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
export declare class VerificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly verificationSelect;
    private formatVerificationResponse;
    verifyByHash(dto: VerifyHashDto): Promise<VerificationResult>;
    verifyByQr(dto: VerifyQrDto): Promise<VerificationResult>;
}
