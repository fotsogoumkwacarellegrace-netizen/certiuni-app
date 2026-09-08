import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { RevokeCertificateDto } from './dto/revoke-certificate.dto';
import { UserRole } from '@prisma/client';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';

@Injectable()
export class CertificatesService {
  private readonly baseUrl: string;

  constructor(private readonly prisma: PrismaService) {
    this.baseUrl = process.env.PUBLIC_VERIFY_URL || 'https://certiuni.app/verify';
  }

  /**
   * Émet un nouveau diplôme, calcule son hash SHA-256 canonique et génère son QR Code
   */
  async issueCertificate(dto: IssueCertificateDto, currentUser: any) {
    const template = await this.prisma.certificateTemplate.findUnique({
      where: { id: dto.templateId },
      include: { university: true },
    });

    if (!template) {
      throw new NotFoundException(`Modèle introuvable avec l ID : ${dto.templateId}`);
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      currentUser.universityId !== template.universityId
    ) {
      throw new ForbiddenException(
        'Vous ne pouvez émettre des diplômes que pour votre propre université',
      );
    }

    const publicIdentifier = this.generatePublicIdentifier(template.university.code);

    const canonicalString = this.buildCanonicalString({
      publicIdentifier,
      studentFirstName: dto.studentFirstName,
      studentLastName: dto.studentLastName,
      degreeTitle: dto.degreeTitle,
      fieldOfStudy: dto.fieldOfStudy,
      issueDate: dto.issueDate,
      universityCode: template.university.code,
    });

    const sha256Hash = crypto.createHash('sha256').update(canonicalString).digest('hex');

    try {
      const certificate = await this.prisma.certificate.create({
        data: {
          publicIdentifier,
          studentFirstName: dto.studentFirstName.trim(),
          studentLastName: dto.studentLastName.trim(),
          studentIdentifier: dto.studentMatricule.trim(),
          degreeTitle: dto.degreeTitle.trim(),
          fieldOfStudy: dto.fieldOfStudy.trim(),
          grade: dto.grade.trim(),
          issueDate: new Date(dto.issueDate),
          canonicalHash: sha256Hash,
          status: 'ISSUED',
          universityId: template.universityId,
          templateId: template.id,
          issuedById: currentUser.id,
          metadataJson: dto.metadataJson ? dto.metadataJson : null,
        },
        include: {
          university: {
            select: { name: true, code: true, logoUrl: true },
          },
        },
      });

      const verificationUrl = `${this.baseUrl}/${publicIdentifier}`;
      const qrCodeDataUrl = await this.generateQrCode(verificationUrl);

      return {
        message: 'Diplôme émis et certifié avec succès',
        certificate: {
          id: certificate.id,
          publicIdentifier: certificate.publicIdentifier,
          canonicalHash: certificate.canonicalHash,
          verificationUrl,
          qrCodeDataUrl,
          studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
          degreeTitle: certificate.degreeTitle,
          universityName: certificate.university.name,
          issuedAt: certificate.issueDate,
        },
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Un diplôme avec cet identifiant ou cette empreinte existe déjà.');
      }
      throw new InternalServerErrorException('Erreur lors de la création du diplôme dans la base de données.');
    }
  }

  /**
   * Lister les diplômes émis
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
   * Vérification publique d un diplôme (Accès libre)
   */
  async verifyCertificatePublic(publicIdentifier: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { publicIdentifier },
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
          publicIdentifier: cert.publicIdentifier,
          studentName: `${cert.studentFirstName} ${cert.studentLastName}`,
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
   * Révoquer un diplôme existant
   */
  async revokeCertificate(
    certificateId: string,
    dto: RevokeCertificateDto,
    currentUser: any,
  ) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
    });

    if (!certificate) {
      throw new NotFoundException(`Diplôme introuvable avec l identifiant : ${certificateId}`);
    }

    if (
      currentUser.role !== UserRole.SUPER_ADMIN &&
      currentUser.universityId !== certificate.universityId
    ) {
      throw new ForbiddenException('Vous ne pouvez pas révoquer un diplôme d un autre établissement.');
    }

    if (certificate.status === 'REVOKED') {
      throw new BadRequestException('Ce diplôme a déjà été révoqué précédemment.');
    }

    const updatedCertificate = await this.prisma.certificate.update({
      where: { id: certificateId },
      data: {
        status: 'REVOKED',
        revocationReason: dto.reason.trim(),
        revokedAt: new Date(),
      },
      include: {
        university: {
          select: { name: true, code: true },
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

  private async generateQrCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 2,
        width: 300,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
    } catch {
      throw new InternalServerErrorException('Échec de la génération du QR Code');
    }
  }

  private generatePublicIdentifier(universityCode: string): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${universityCode.toUpperCase()}-${year}-${randomHex}`;
  }
}