import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';

@Injectable()
export class CertificateService {
    private readonly baseUrl: string;

    constructor(private readonly prisma: PrismaService) {
        // URL de base du portail public de vérification
        this.baseUrl = process.env.PUBLIC_VERIFY_URL || 'https://certiuni.app/verify';
    }

    /**
     * Émet un nouveau diplôme, calcule son hash SHA-256 canonique et génère son QR Code
     */
    async issueCertificate(dto: CreateCertificateDto, createdById: string) {
        // 1. Vérifier que l'université existe
        const university = await this.prisma.university.findUnique({
            where: { id: dto.universityId },
        });

        if (!university) {
            throw new NotFoundException(`Établissement introuvable avec l'ID : ${dto.universityId}`);
        }

        // 2. Générer un identifiant public unique et lisible (Ex: CERT-2026-A8F9K2)
        const publicIdentifier = this.generatePublicIdentifier(university.code);

        // 3. Calcul du Hash Canonique SHA-256
        const canonicalString = this.buildCanonicalString({
            publicIdentifier,
            studentFirstName: dto.studentFirstName,
            studentLastName: dto.studentLastName,
            degreeTitle: dto.degreeTitle,
            fieldOfStudy: dto.fieldOfStudy,
            issueDate: dto.issueDate,
            universityCode: university.code,
        });

        const sha256Hash = crypto.createHash('sha256').update(canonicalString).digest('hex');

        // 4. Construction de l'URL de vérification et génération du QR Code
        const verificationUrl = `${this.baseUrl}/${publicIdentifier}`;
        const qrCodeDataUrl = await this.generateQrCode(verificationUrl);

        try {
            // 5. Sauvegarde en Base de Données
            const certificate = await this.prisma.certificate.create({
                data: {
                    publicIdentifier,
                    studentFirstName: dto.studentFirstName.trim(),
                    studentLastName: dto.studentLastName.trim(),
                    degreeTitle: dto.degreeTitle.trim(),
                    fieldOfStudy: dto.fieldOfStudy.trim(),
                    grade: dto.grade.trim(),
                    issueDate: new Date(dto.issueDate),
                    canonicalHash: sha256Hash,
                    qrCodeDataUrl: qrCodeDataUrl,
                    status: 'ISSUED',
                    universityId: dto.universityId,
                    createdById: createdById,
                    metadataJson: dto.metadataJson ? JSON.parse(dto.metadataJson) : null,
                },
                include: {
                    university: {
                        select: {
                            name: true,
                            code: true,
                            logoUrl: true,
                        },
                    },
                },
            });

            return {
                message: 'Diplôme émis et certifié avec succès',
                certificate: {
                    id: certificate.id,
                    publicIdentifier: certificate.publicIdentifier,
                    canonicalHash: certificate.canonicalHash,
                    verificationUrl,
                    qrCodeDataUrl: certificate.qrCodeDataUrl,
                    studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
                    degreeTitle: certificate.degreeTitle,
                    universityName: certificate.university.name,
                    issuedAt: certificate.issueDate,
                },
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Un diplôme avec cet identifiant ou cet empreinte existe déjà.');
            }
            throw new InternalServerErrorException("Erreur lors de la création du diplôme dans la base de données.");
        }
    }

    /**
     * Construit la chaîne canonique normalisée (Déterministe)
     * L'ordre et la casse des éléments sont rigoureusement fixés
     */
    private buildCanonicalString(params: {
        publicIdentifier: string;
        studentFirstName: string;
        studentLastName: string;
        degreeTitle: string;
        fieldOfStudy: string;
        issueDate: string;
        universityCode: string;
    }): string {
        const clean = (str: string) => str.trim().toUpperCase();

        // Format canonique strict : ID|NOM|PRENOM|DIPLOME|DOMAINE|UNIVERSITE|DATE
        return [
            clean(params.publicIdentifier),
            clean(params.studentLastName),
            clean(params.studentFirstName),
            clean(params.degreeTitle),
            clean(params.fieldOfStudy),
            clean(params.universityCode),
            clean(params.issueDate),
        ].join('|');
    }

    /**
     * Génère l'image du QR Code au format Data URL PNG
     */
    private async generateQrCode(url: string): Promise<string> {
        try {
            return await QRCode.toDataURL(url, {
                errorCorrectionLevel: 'H', // Correction d'erreur haute
                type: 'image/png',
                margin: 2,
                width: 300,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
            });
        } catch (err) {
            throw new InternalServerErrorException('Échec de la génération du QR Code');
        }
    }

    /**
     * Génère un code public court (Ex: UNIA-2026-X8B9)
     */
    private generatePublicIdentifier(universityCode: string): string {
        const year = new Date().getFullYear();
        const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
        return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
    }

    / À ajouter à l'intérieur de la classe CertificateService :

/**
 * Révoque un diplôme existant
 */
async revokeCertificate(
    certificateId: string,
    dto: RevokeCertificateDto,
    user: { id: string; role: RoleEnum; universityId?: string }
) {
    // 1. Recherche du diplôme en base
    const certificate = await this.prisma.certificate.findUnique({
        where: { id: certificateId },
    });

    if (!certificate) {
        throw new NotFoundException(`Diplôme introuvable avec l'identifiant : ${certificateId}`);
    }

    // 2. Isolation Multi-Tenant : Un Admin de l'Université A ne peut pas révoquer un diplôme de l'Université B
    if (user.role === RoleEnum.ADMIN_UNIV && certificate.universityId !== user.universityId) {
        throw new ForbiddenException('Vous ne pouvez pas révoquer un diplôme émis par un autre établissement.');
    }

    // 3. Vérification de l'état actuel du diplôme
    if (certificate.status === 'REVOKED') {
        throw new BadRequestException('Ce diplôme a déjà été révoqué précédemment.');
    }

    // 4. Mise à jour de l'état dans la base de données
    const updatedCertificate = await this.prisma.certificate.update({
        where: { id: certificateId },
        data: {
            status: 'REVOKED',
            revocationReason: dto.reason.trim(),
            revokedAt: new Date(),
            revokedById: user.id,
        },
        include: {
            university: {
                select: {
                    name: true,
                    code: true,
                },
            },
        },
    });

    return {
        message: 'Le diplôme a été révoqué avec succès.',
        certificate: {
            id: updatedCertificate.id,
            publicIdentifier: updatedCertificate.publicIdentifier,
            studentName: `${updatedCertificate.studentFirstName} ${updatedCertificate.studentLastName}`,
            degreeTitle: updatedCertificate.degreeTitle,
            status: updatedCertificate.status,
            revocationReason: updatedCertificate.revocationReason,
            revokedAt: updatedCertificate.revokedAt,
            universityName: updatedCertificate.university.name,
        },
    };
}
}// src/certificates/certificates.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';
import { UserRole } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcul du hash cryptographique SHA-256 des données du diplôme
   */
  private generateCertificateHash(payload: Record<string, any>): string {
    const dataString = JSON.stringify(payload);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Émettre un nouveau diplôme
   */
  async issue(dto: IssueCertificateDto, currentUser: any) {
    // 1. Vérifier que le modèle existe
    const template = await this.prisma.certificateTemplate.findUnique({
      where: { id: dto.templateId },
    });

    if (!template) {
      throw new NotFoundException('Modèle de diplôme introuvable');
    }

    // 2. Vérifier que l'utilisateur a le droit d'émettre pour cette université
    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      currentUser.universityId !== template.universityId
    ) {
      throw new ForbiddenException(
        'Vous ne pouvez émettre des diplômes que pour votre propre université',
      );
    }

    // 3. Générer un numéro de certificat unique (ex: CERT-UY1-2026-X8F9)
    const uniqueSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const certificateNumber = `CERT-${template.id.substring(0, 4)}-2026-${uniqueSuffix}`;

    // 4. Calculer l'empreinte SHA-256
    const certificateHash = this.generateCertificateHash({
      certificateNumber,
      studentName: dto.studentName,
      studentMatricule: dto.studentMatricule,
      degreeTitle: dto.degreeTitle,
      fieldOfStudy: dto.fieldOfStudy,
      grade: dto.grade,
      issueDate: dto.issueDate,
      universityId: template.universityId,
    });

    // 5. Enregistrer en base de données
    return this.prisma.certificate.create({
      data: {
        certificateNumber,
        studentName: dto.studentName,
        studentMatricule: dto.studentMatricule,
        degreeTitle: dto.degreeTitle,
        fieldOfStudy: dto.fieldOfStudy,
        grade: dto.grade,
        issueDate: new Date(dto.issueDate),
        certificateHash,
        metadata: dto.metadata || {},
        templateId: template.id,
        universityId: template.universityId,
        issuerId: currentUser.id,
        status: 'ISSUED',
      },
      include: {
        university: {
          select: { id: true, name: true, code: true },
        },
        template: {
          select: { id: true, name: true },
        },
        issuer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  /**
   * Lister les diplômes (avec filtrage par université selon le rôle)
   */
  async findAll(currentUser: any) {
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return this.prisma.certificate.findMany({
        include: {
          university: { select: { name: true, code: true } },
          template: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.certificate.findMany({
      where: { universityId: currentUser.universityId },
      include: {
        university: { select: { name: true, code: true } },
        template: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Vérification publique d'un diplôme (accessible sans authentification)
   */
  async verifyPublic(certificateNumber: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { certificateNumber },
      include: {
        university: {
          select: { name: true, code: true, logoUrl: true },
        },
        template: {
          select: { name: true, layoutConfig: true },
        },
      },
    });

    if (!cert) {
      return {
        isValid: false,
        message: 'Aucun diplôme correspondant à cet identifiant n a été trouvé.',
      };
    }

    if (cert.status === 'REVOKED') {
      return {
        isValid: false,
        status: 'REVOKED',
        revokedAt: cert.revokedAt,
        revocationReason: cert.revocationReason,
        message: 'Ce diplôme a été révoqué par l institution émettrice.',
        certificate: {
          certificateNumber: cert.certificateNumber,
          studentName: cert.studentName,
          universityName: cert.university.name,
        },
      };
    }

    return {
      isValid: true,
      status: cert.status,
      message: 'Diplôme authentique et valide.',
      certificate: cert,
    };
  }

  /**
   * Révoquer un diplôme
   */
  async revoke(id: string, dto: RevokeCertificateDto, currentUser: any) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
    });

    if (!cert) {
      throw new NotFoundException('Diplôme introuvable');
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      currentUser.universityId !== cert.universityId
    ) {
      throw new ForbiddenException('Action non autorisée sur ce diplôme');
    }

    return this.prisma.certificate.update({
      where: { id },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
        revocationReason: dto.reason,
      },
    });
  }
}