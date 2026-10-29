import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface VerificationResult {
    isValid: boolean;
    status: 'VALID' | 'REVOKED' | 'EXPIRED' | 'NOT_FOUND';
    documentDetails?: {
        documentNumber: string;
        studentName: string;
        degreeTitle: string;
        institutionName: string;
        issueDate: Date;
        revocationReason?: string;
    };
    verifiedAt: Date;
}

@Injectable()
export class VerifyService {
    private readonly logger = new Logger(VerifyService.name);

    constructor(private readonly prisma: PrismaService) { }

    async verifyByHash(hash: string): Promise<VerificationResult> {
        const formattedHash = hash.trim().toLowerCase();

        const certificate = await this.prisma.certificate.findFirst({
            where: { canonicalHash: formattedHash },
            include: {
                university: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!certificate) {
            this.logger.warn(`[Verification] Tentative de vérification échouée pour le hash: ${formattedHash}`);
            throw new NotFoundException('Aucun document certifié ne correspond à cette empreinte cryptographique.');
        }

        const isRevoked = certificate.status === 'REVOKED';
        const isValid = certificate.status === 'ISSUED';

        return {
            isValid,
            status: isRevoked ? 'REVOKED' : isValid ? 'VALID' : 'EXPIRED',
            documentDetails: {
                documentNumber: certificate.publicIdentifier,
                studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
                degreeTitle: certificate.degreeTitle,
                institutionName: certificate.university.name,
                issueDate: certificate.issueDate,
                ...(isRevoked && { revocationReason: certificate.revocationReason || 'Document révoqué par l\'institution.' }),
            },
            verifiedAt: new Date(),
        };
    }

    async verifyByQrData(qrData: string): Promise<VerificationResult> {
        let hash = qrData.trim();
        if (hash.includes('/verify/')) {
            hash = hash.split('/verify/').pop() || hash;
        }

        hash = hash.split('?')[0];

        return this.verifyByHash(hash);
    }
}