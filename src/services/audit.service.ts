import { AuditAction } from '@prisma/client';
import { prisma } from '../config/database';

export { AuditAction };

export interface LogActionParams {
    action: AuditAction;
    userId?: string;
    universityId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
}

export class AuditService {
    /**
     * Enregistre une entrée de journal d'audit de sécurité dans la base de données.
     * L'exécution est encapsulée dans un bloc try/catch pour éviter qu'un échec d'audit
     * n'interrompe le flux principal de l'application.
     */
    public static async logAction(params: LogActionParams): Promise<void> {
        try {
            const { action, userId, universityId, ipAddress, userAgent, metadata } = params;

            // Sanitisation de l'adresse IP si elle contient des préfixes IPv6 (ex: ::ffff:127.0.0.1)
            const cleanIp = ipAddress ? ipAddress.replace(/^.*:/, '') : null;

            await prisma.auditLog.create({
                data: {
                    action,
                    userId: userId || null,
                    universityId: universityId || null,
                    ipAddress: cleanIp,
                    userAgent: userAgent ? userAgent.substring(0, 512) : null,
                    metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
                },
            });
        } catch (error) {
            // Logger l'erreur système sans bloquer la requête client
            console.error('[AuditService Error] Échec de l\'enregistrement de la piste d\'audit :', error);
        }
    }

    /**
     * Récupère l'historique d'audit filtré par université ou par utilisateur
     */
    public static async getLogs(options: {
        universityId?: string;
        userId?: string;
        action?: AuditAction;
        limit?: number;
        offset?: number;
    }) {
        const { universityId, userId, action, limit = 50, offset = 0 } = options;

        return await prisma.auditLog.findMany({
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


// import { prisma } from '../config/database';

// export enum AuditAction {
//     USER_LOGIN = 'USER_LOGIN',
//     CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
//     CERTIFICATE_REVOKED = 'CERTIFICATE_REVOKED',
//     BATCH_INGESTION = 'BATCH_INGESTION',
//     VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS',
// }

// export class AuditService {
//     public static async logAction(params: {
//         action: AuditAction;
//         userId?: string;
//         universityId?: string;
//         ipAddress?: string;
//         userAgent?: string;
//         metadata?: Record<string, unknown>;
//     }): Promise<void> {
//         try {
//             await prisma.securityAuditLog.create({
//                 data: {
//                     action: params.action,
//                     userId: params.userId,
//                     universityId: params.universityId,
//                     ipAddress: params.ipAddress,
//                     userAgent: params.userAgent,
//                     metadata: params.metadata ? JSON.stringify(params.metadata) : null,
//                 },
//             });
//         } catch (err) {
//             console.error('Audit Log insertion failed:', err);
//         }
//     }
// }