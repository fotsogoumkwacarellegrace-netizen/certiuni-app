import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAuditDto } from './dto/query-audit.dto';
export interface CreateAuditLogParams {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    details?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
}
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly auditInclude;
    log(params: CreateAuditLogParams): Promise<{
        id: string;
        universityId: string | null;
        createdAt: Date;
        userId: string | null;
        metadata: Prisma.JsonValue | null;
        action: import(".prisma/client").$Enums.AuditAction;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
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
            metadata: Prisma.JsonValue | null;
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
        metadata: Prisma.JsonValue | null;
        action: import(".prisma/client").$Enums.AuditAction;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
}
