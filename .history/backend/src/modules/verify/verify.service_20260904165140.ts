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

        // Recherche de l'attestation ou du diplôme par le hash SHA-256 de son empreinte
        const document = await this.prisma.document.findFirst({
            where: { documentHash: formattedHash },
            include: {
                student: true,
                institution: true,
            },
        });

        if (!document) {
            this.logger.warn(`[Verification] Tentative de vérification échouée pour le hash: ${formattedHash}`);
            throw new NotFoundException('Aucun document certifié ne correspond à cette empreinte cryptographique.');
        }

        const isRevoked = document.status === 'REVOKED';
        const isValid = document.status === 'ISSUED' || document.status === 'VERIFIED';

        return {
            isValid,
            status: isRevoked ? 'REVOKED' : isValid ? 'VALID' : 'EXPIRED',
            documentDetails: {
                documentNumber: document.documentNumber,
                studentName: `${document.student.firstName} ${document.student.lastName}`,
                degreeTitle: document.title,
                institutionName: document.institution.name,
                issueDate: document.createdAt,
                ...(isRevoked && { revocationReason: document.revocationReason || 'Document révoqué par l\'institution.' }),
            },
            verifiedAt: new Date(),
        };
    }

    async verifyByQrData(qrData: string): Promise<VerificationResult> {
        // Extraction automatique du hash si le QR code contient une URL complète
        let hash = qrData.trim();
        if (hash.includes('/verify/')) {
            hash = hash.split('/verify/').pop() || hash;
        }

        // Nettoyage des paramètres d'URL éventuels
        hash = hash.split('?')[0];

        return this.verifyByHash(hash);
    }
}