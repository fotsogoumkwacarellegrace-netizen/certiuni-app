"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = exports.NotificationCategory = void 0;
const database_1 = require("../config/database");
const logger_util_1 = __importDefault(require("../common/utils/logger.util"));
var NotificationCategory;
(function (NotificationCategory) {
    NotificationCategory["FINANCIAL"] = "FINANCIAL";
    NotificationCategory["SYSTEM"] = "SYSTEM";
    NotificationCategory["SECURITY"] = "SECURITY";
})(NotificationCategory || (exports.NotificationCategory = NotificationCategory = {}));
class NotificationService {
    async createNotification(payload) {
        try {
            const notification = await database_1.prisma.notification.create({
                data: {
                    universityId: payload.universityId,
                    type: 'GENERAL',
                    title: payload.title,
                    message: payload.message,
                    isRead: false,
                },
            });
            logger_util_1.default.info(`Notification created for university ${payload.universityId}`, { notificationId: notification.id });
            return notification;
        }
        catch (error) {
            logger_util_1.default.error('Failed to create notification', { error });
            throw error;
        }
    }
    async getNotifications(universityId, limit = 50, offset = 0) {
        try {
            return await database_1.prisma.notification.findMany({
                where: { universityId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            });
        }
        catch (error) {
            logger_util_1.default.error('Failed to fetch notifications', { error });
            throw error;
        }
    }
    async markAsRead(notificationId) {
        try {
            return await database_1.prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true },
            });
        }
        catch (error) {
            logger_util_1.default.error('Failed to mark notification as read', { error });
            throw error;
        }
    }
    async notifyUniversityOfCertificateIssued(universityId, studentName, certificateCount) {
        await this.createNotification({
            universityId,
            title: `${certificateCount} diplôme(s) émis`,
            message: `${studentName} a reçu son diplôme. Consultez votre tableau de bord pour plus de détails.`,
            category: NotificationCategory.SYSTEM,
        });
    }
    async notifyPaymentReceived(universityId, amount, studentName) {
        await this.createNotification({
            universityId,
            title: `Paiement reçu: ${amount} FCFA`,
            message: `Paiement de ${amount} FCFA reçu de ${studentName} pour un diplôme.`,
            category: NotificationCategory.FINANCIAL,
        });
    }
    async notifySecurityAlert(universityId, alertMessage) {
        await this.createNotification({
            universityId,
            title: 'Alerte de sécurité',
            message: alertMessage,
            category: NotificationCategory.SECURITY,
        });
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
//# sourceMappingURL=notification.service.js.map