import { AuditAction } from '@prisma/client';
export { AuditAction };
export interface LogActionParams {
    action: AuditAction;
    userId?: string;
    universityId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}
export declare class AuditService {
    static logAction(params: LogActionParams): Promise<void>;
    static getLogs(options: {
        universityId?: string;
        userId?: string;
        action?: AuditAction;
        limit?: number;
        offset?: number;
    }): Promise<({
        user: {
            role: import(".prisma/client").$Enums.UserRole;
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        university: {
            code: string;
            name: string;
            id: string;
        } | null;
    } & {
        id: string;
        universityId: string | null;
        createdAt: Date;
        userId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        action: import(".prisma/client").$Enums.AuditAction;
        ipAddress: string | null;
        userAgent: string | null;
    })[]>;
}
