import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CertificateStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { verifyCertificateQrSignature } from '../../common/utils/qr-signature.util';

export interface VerificationResult {
    isValid: boolean;
    status: 'VALID' | 'REVOKED' | 'PENDING' | 'FAILED' | 'NOT_FOUND';
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
            where: {
                canonicalHash: { equals: formattedHash, mode: 'insensitive' },
            },
            include: { university: { select: { name: true } } },
        });

        if (!certificate) {
            this.logger.warn('Certificate hash verification did not match a record');
            throw new NotFoundException(
                'Aucun document certifié ne correspond à cette empreinte cryptographique.',
            );
        }

        return this.format(certificate);
    }

    async verifyByQrData(qrData: string): Promise<VerificationResult> {
        const input = qrData.trim();
        let identifier = input;

        if (/^https?:\/\//i.test(input)) {
            let url: URL;
            try {
                url = new URL(input);
            } catch {
                throw new BadRequestException('URL du QR code invalide.');
            }

            identifier = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() ?? '');
            const signature = url.searchParams.get('signature');
            if (!identifier || !signature || !verifyCertificateQrSignature(identifier, signature)) {
                throw new BadRequestException('Signature du QR code invalide ou absente.');
            }
        } else if (input.includes('/') || input.includes('?')) {
            throw new BadRequestException('Le contenu du QR code est invalide.');
        }

        const certificate = await this.prisma.certificate.findUnique({
            where: { publicIdentifier: identifier.toUpperCase() },
            include: { university: { select: { name: true } } },
        });

        if (!certificate) {
            throw new NotFoundException(
                'Aucun document trouvé pour le numéro de certificat fourni.',
            );
        }

        return this.format(certificate);
    }

    private format(certificate: {
        publicIdentifier: string;
        studentFirstName: string;
        studentLastName: string;
        degreeTitle: string;
        issueDate: Date;
        status: CertificateStatus;
        revocationReason: string | null;
        university: { name: string };
    }): VerificationResult {
        const isRevoked = certificate.status === CertificateStatus.REVOKED;
        const isValid = certificate.status === CertificateStatus.ISSUED;
        return {
            isValid,
            status: isRevoked
                ? 'REVOKED'
                : isValid
                    ? 'VALID'
                    : certificate.status === CertificateStatus.PENDING
                        ? 'PENDING'
                        : 'FAILED',
            documentDetails: {
                documentNumber: certificate.publicIdentifier,
                studentName: `${certificate.studentFirstName} ${certificate.studentLastName}`,
                degreeTitle: certificate.degreeTitle,
                institutionName: certificate.university.name,
                issueDate: certificate.issueDate,
                ...(isRevoked && certificate.revocationReason
                    ? { revocationReason: certificate.revocationReason }
                    : {}),
            },
            verifiedAt: new Date(),
        };
    }
}
