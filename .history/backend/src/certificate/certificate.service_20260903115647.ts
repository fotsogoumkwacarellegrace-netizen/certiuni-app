// src/certificates/certificates.service.ts
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
    constructor(private readonly prisma: PrismaService) { }

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