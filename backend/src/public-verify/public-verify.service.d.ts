import { PrismaService } from '../prisma/prisma.service';
import { VerifyCertificateResponseDto } from './dto/verify-reponse.dto';
export declare class PublicVerifyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    verifyByIdentifier(publicIdentifier: string): Promise<VerifyCertificateResponseDto>;
    verifyByHash(hash: string): Promise<VerifyCertificateResponseDto>;
}
