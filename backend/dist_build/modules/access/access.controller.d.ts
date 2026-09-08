import { AccessService } from './access.service';
import { CheckAccessDto } from './dto/check-access.dto';
export declare class AccessController {
    private readonly accessService;
    constructor(accessService: AccessService);
    checkAccess(dto: CheckAccessDto): Promise<{
        isAllowed: boolean;
        reason?: string;
    }>;
    getUserPermissions(id: string): Promise<{
        userId: string;
        role: "SUPER_ADMIN";
        isSuperAdmin: boolean;
        permissions: string[];
        universityId?: undefined;
    } | {
        userId: string;
        role: "ISSUER" | "VERIFIER" | "UNIV_ADMIN" | "STUDENT";
        universityId: string;
        isSuperAdmin: boolean;
        permissions: string[];
    }>;
}
