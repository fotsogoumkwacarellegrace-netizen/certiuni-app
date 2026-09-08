import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { VerifyHashDto } from './dto/verify-hash.dto';
import { VerifyQrDto } from './dto/verify-qr.dto';

export interface VerificationResult {
    isValid: boolean;
    status: 'AUTHENTIC' | 'REVOKED' | 'NOT_FOUND';
    message: string;
    verifiedAt: Date;
    documentDetails?: {
        certificateNumber: string;
        title: string;
        mention: string | null;
        issuedAt: Date;
        isRevoked: boolean;
        revokedAt: Date | null;
        revocationReason: string | null;
        documentHash: string;
        student: {
            firstName: string;
            lastName: string;
            matricule: string;
        };
        documentType: {
            code: string;
            name: string;
        };
        institution: {
            name: string;
            code: string;
        };
        academicYear: string;
    };
}

@Injectable()
export class VerificationService {
    constructor(private readonly prisma: PrismaService) { }

    private readonly verificationSelect = {
        id: true,
        certificateNumber: true,
        title: true,
        mention: true,
        issuedAt: true,
        documentHash: true,
        isRevoked: true,
        revokedAt: true,
        revocationReason: true,
        student: {
            select: {
                matricule: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        },
        documentType: {
            select: {
                code: true,
                name: true,
            },
        },
        enrollment: {
            select: {
                academicYear: {
                    select: { year: true },
                },
                program: {
                    select: {
                        department: {
                            select: {
                                faculty: {
                                    select: {
                                        university: {
                                            select: {
                                                name: true,
                                                code: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    /**
     * Formate la réponse publique de vérification
     */
    private formatVerificationResponse(certificate: any): VerificationResult {
        const isRevoked = certificate.isRevoked;

        return {
            isValid: !isRevoked,
            status: isRevoked ? 'REVOKED' : 'AUTHENTIC',
            message: isRevoked
                ? 'Ce document a été révoqué par l\'établissement émetteur.'
                : 'Document authentique et valide émis par une institution certifiée.',
            verifiedAt: new Date(),
            documentDetails: {
                certificateNumber: certificate.certificateNumber,
                title: certificate.title,
                mention: certificate.mention,
                issuedAt: certificate.issuedAt,
                isRevoked: certificate.isRevoked,
                revokedAt: certificate.revokedAt,
                revocationReason: certificate.revocationReason,
                documentHash: certificate.documentHash,
                student: {
                    firstName: certificate.student.user.firstName,
                    lastName: certificate.student.user.lastName,
                    matricule: certificate.student.matricule,
                },
                documentType: {
                    code: certificate.documentType.code,
                    name: certificate.documentType.name,
                },
                institution: {
                    name: certificate.enrollment?.program?.department?.faculty?.university?.name || 'N/A',
                    code: certificate.enrollment?.program?.department?.faculty?.university?.code || 'N/A',
                },
                academicYear: certificate.enrollment?.academicYear?.year || 'N/A',
            },
        };
    }

    async verifyByHash(dto: VerifyHashDto): Promise<VerificationResult> {
        const cleanHash = dto.hash.trim().toLowerCase();

        const certificate = await this.prisma.certificate.findFirst({
            where: {
                hash:  {
                    equals: cleanHash,
                    mode: 'insensitive',
                },
            },
            select: this.verificationSelect,
        });

        if (!certificate) {
            throw new NotFoundException({
                isValid: false,
                status: 'NOT_FOUND',
                message: 'Aucun document correspondant à ce hash SHA-256 n\'a été trouvé.',
                verifiedAt: new Date(),
            });
        }

        return this.formatVerificationResponse(certificate);
    }

    async verifyByQr(dto: VerifyQrDto): Promise<VerificationResult> {
        let rawInput = dto.qrData.trim();

        // Extrait le numéro si une URL complète est scannée (ex: https://verify.certiuni.com/CERT-2026-X9A2B4C)
        if (rawInput.includes('/')) {
            const parts = rawInput.split('/');
            rawInput = parts[parts.length - 1];
        }

        const certificateNumber = rawInput.toUpperCase();

        const certificate = await this.prisma.certificate.findUnique({
            where: { number: certificateNumber }, // Or your exact schema field name
            select: this.verificationSelect,
        });

        if (!certificate) {
            throw new NotFoundException({
                isValid: false,
                status: 'NOT_FOUND',
                message: `Aucun document trouvé pour le numéro de certificat "${certificateNumber}".`,
                verifiedAt: new Date(),
            });
        }

        return this.formatVerificationResponse(certificate);
    }
}