import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyCertificateResponseDto } from './dto/verify-reponse.dto';
@Injectable()
export class PublicVerifyService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Vérifie un diplôme à partir de son identifiant public unique (Ex: UNIA-2026-X8B9)
     */
    async verifyByIdentifier(publicIdentifier: string): Promise<VerifyCertificateResponseDto> {
        const cleanIdentifier = publicIdentifier.trim().toUpperCase();

        // 1. Recherche du diplôme dans la base de données
        const certificate = await this.prisma.certificate.findUnique({
            where: { publicIdentifier: cleanIdentifier },
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

        // 2. Si le diplôme n'existe pas
        if (!certificate) {
            throw new NotFoundException({
                isValid: false,
                message: 'Aucun enregistrement ne correspond à cet identifiant de diplôme.',
                code: 'CERTIFICATE_NOT_FOUND',
            });
        }

        // 3. Construction du DTO de réponse publique
        return {
            isValid: certificate.status === 'ISSUED',
            publicIdentifier: certificate.publicIdentifier,
            studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
            degreeTitle: certificate.degreeTitle,
            fieldOfStudy: certificate.fieldOfStudy,
            grade: certificate.grade,
            issueDate: certificate.issueDate,
            status: certificate.status as 'ISSUED' | 'REVOKED',
            canonicalHash: certificate.canonicalHash,
            university: {
                name: certificate.university.name,
                code: certificate.university.code,
                logoUrl: certificate.university.logoUrl || undefined,
            },
            revocationReason: certificate.status === 'REVOKED' ? certificate.revocationReason || 'Diplôme révoqué par l\'établissement' : undefined,
        };
    }

    /**
     * Vérification complémentaire par empreinte SHA-256 directe
     */
    async verifyByHash(hash: string): Promise<VerifyCertificateResponseDto> {
        const cleanHash = hash.trim().toLowerCase();

        const certificate = await this.prisma.certificate.findFirst({
            where: { canonicalHash: cleanHash },
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

        if (!certificate) {
            throw new NotFoundException({
                isValid: false,
                message: 'L\'empreinte cryptographique fournie ne correspond à aucun document certifié.',
                code: 'HASH_NOT_FOUND',
            });
        }

        return this.verifyByIdentifier(certificate.publicIdentifier);
    }
}