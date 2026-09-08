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
export declare class VerifyService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    verifyByHash(hash: string): Promise<VerificationResult>;
    verifyByQrData(qrData: string): Promise<VerificationResult>;
}
