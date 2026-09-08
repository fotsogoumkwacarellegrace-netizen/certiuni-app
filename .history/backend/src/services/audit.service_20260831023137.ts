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