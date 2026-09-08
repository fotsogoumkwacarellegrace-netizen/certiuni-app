import { AuditService } from './audit.service';
import { QueryAuditDto } from './dto/query-audit.dto';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(query: QueryAuditDto): Promise<{
        data: ({
            user: {
                role: import(".prisma/client").$Enums.UserRole;
                email: string;
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            universityId: string | null;
            createdAt: Date;
            userId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            action: import(".prisma/client").$Enums.AuditAction;
            ipAddress: string | null;
            userAgent: string | null;
        })[];
        meta: {
            total: number;
            limit: number;
            offset: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        universityId: string | null;
        createdAt: Date;
        userId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        action: import(".prisma/client").$Enums.AuditAction;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
}
