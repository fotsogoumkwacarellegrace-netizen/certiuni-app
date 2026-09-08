import { PrismaService } from '../prisma/prisma.service';
import { CheckAccessDto } from './dto/check-access.dto';
export declare class AccessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkAccess(dto: CheckAccessDto): Promise<{
        isAllowed: boolean;
        reason?: string;
    }>;
    getUserEffectivePermissions(userId: string): Promise<{
        userId: string;
        role: "SUPER_ADMIN";
        isSuperAdmin: boolean;
        permissions: string[];
        universityId?: undefined;
    } | {
        userId: string;
        role: "ISSUER" | "VERIFIER" | "UNIV_ADMIN" | "STUDENT";
        universityId: string | null;
        isSuperAdmin: boolean;
        permissions: string[];
    }>;
}
