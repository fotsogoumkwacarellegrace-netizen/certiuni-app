"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = exports.AuditAction = void 0;
const client_1 = require("@prisma/client");
Object.defineProperty(exports, "AuditAction", { enumerable: true, get: function () { return client_1.AuditAction; } });
const database_1 = require("../config/database");
class AuditService {
    static async logAction(params) {
        try {
            const { action, userId, universityId, ipAddress, userAgent, metadata } = params;
            const cleanIp = ipAddress ? ipAddress.replace(/^.*:/, '') : null;
            await database_1.prisma.auditLog.create({
                data: {
                    action,
                    userId: userId || null,
                    universityId: universityId || null,
                    ipAddress: cleanIp,
                    userAgent: userAgent ? userAgent.substring(0, 512) : null,
                    metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
                },
            });
        }
        catch (error) {
            console.error('[AuditService Error] Échec de l\'enregistrement de la piste d\'audit :', error);
        }
    }
    static async getLogs(options) {
        const { universityId, userId, action, limit = 50, offset = 0 } = options;
        return await database_1.prisma.auditLog.findMany({
            where: {
                ...(universityId && { universityId }),
                ...(userId && { userId }),
                ...(action && { action }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
                university: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: Math.min(limit, 100),
            skip: offset,
        });
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=audit.service.js.map