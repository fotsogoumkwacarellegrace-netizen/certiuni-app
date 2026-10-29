import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CertificateStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { verifyCertificateQrSignature } from '../../common/utils/qr-signature.util';
import { VerifyHashDto } from './dto/verify-hash.dto';
import { VerifyQrDto } from './dto/verify-qr.dto';

export interface VerificationResult {
    isValid: boolean;
    status: 'AUTHENTIC' | 'REVOKED' | 'PENDING' | 'FAILED' | 'NOT_FOUND';
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
        institution: {
            name: string;
            code: string;
        };
    };
}

const certificateSelect = Prisma.validator<Prisma.CertificateSelect>()({
    publicIdentifier: true,
    canonicalHash: true,
    studentFirstName: true,
    studentLastName: true,
    studentIdentifier: true,
    degreeTitle: true,
    grade: true,
    issueDate: true,
    status: true,
    revokedAt: true,
    revocationReason: true,
    university: { select: { name: true, code: true } },
});

type CertificateRecord = Prisma.CertificateGetPayload<{
    select: typeof certificateSelect;
}>;

@Injectable()
export class VerificationService {
    constructor(private readonly prisma: PrismaService) { }

    async verifyHash(dto: VerifyHashDto): Promise<VerificationResult> {
        const cleanHash = dto.hash.trim().toLowerCase();
        const certificate = await this.prisma.certificate.findFirst({
            where: {
                canonicalHash: { equals: cleanHash, mode: 'insensitive' },
            },
            select: certificateSelect,
        });

        if (!certificate) {
            throw new NotFoundException({
                isValid: false,
                status: 'NOT_FOUND',
                message: "Aucun document correspondant à ce hash SHA-256 n'a été trouvé.",
                verifiedAt: new Date(),
            });
        }

        return this.format(certificate);
    }

    async verifyQr(dto: VerifyQrDto): Promise<VerificationResult> {
        const qrData = dto.qrData.trim();
        let identifier = qrData;

        if (/^https?:\/\//i.test(qrData)) {
            let url: URL;
            try {
                url = new URL(qrData);
            } catch {
                throw new BadRequestException('URL du QR code invalide.');
            }

            identifier = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() ?? '');
            const signature = url.searchParams.get('signature');
            if (!identifier || !signature || !verifyCertificateQrSignature(identifier, signature)) {
                throw new BadRequestException('Signature du QR code invalide ou absente.');
            }
        } else if (qrData.includes('/') || qrData.includes('?')) {
            throw new BadRequestException('Le contenu du QR code est invalide.');
        }

        const certificate = await this.prisma.certificate.findUnique({
            where: { publicIdentifier: identifier.toUpperCase() },
            select: certificateSelect,
        });

        if (!certificate) {
            throw new NotFoundException({
                isValid: false,
                status: 'NOT_FOUND',
                message: "Aucun document trouvé pour ce numéro de certificat.",
                verifiedAt: new Date(),
            });
        }

        return this.format(certificate);
    }

    private format(certificate: CertificateRecord): VerificationResult {
        const isRevoked = certificate.status === CertificateStatus.REVOKED;
        const isValid = certificate.status === CertificateStatus.ISSUED;
        const status: VerificationResult['status'] = isRevoked
            ? 'REVOKED'
            : isValid
                ? 'AUTHENTIC'
                : certificate.status === CertificateStatus.PENDING
                    ? 'PENDING'
                    : 'FAILED';

        return {
            isValid,
            status,
            message: isRevoked
                ? "Ce document a été révoqué par l'établissement émetteur."
                : isValid
                    ? 'Document authentique et valide émis par une institution certifiée.'
                    : 'Ce document ne peut pas être confirmé comme authentique.',
            verifiedAt: new Date(),
            documentDetails: {
                certificateNumber: certificate.publicIdentifier,
                title: certificate.degreeTitle,
                mention: certificate.grade,
                issuedAt: certificate.issueDate,
                isRevoked,
                revokedAt: certificate.revokedAt,
                revocationReason: certificate.revocationReason,
                documentHash: certificate.canonicalHash,
                student: {
                    firstName: certificate.studentFirstName,
                    lastName: certificate.studentLastName,
                    matricule: certificate.studentIdentifier,
                },
                institution: {
                    name: certificate.university.name,
                    code: certificate.university.code,
                },
            },
        };
    }
}
