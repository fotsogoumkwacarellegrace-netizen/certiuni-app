import { prisma } from '../config/database';
import logger from '../utils/logger';

export enum NotificationCategory {
    FINANCIAL = 'FINANCIAL',
    SYSTEM = 'SYSTEM',
    SECURITY = 'SECURITY',
}

export interface CreateNotificationPayload {
    universityId: string;
    title: string;
    message: string;
    category: NotificationCategory;
}

export class NotificationService {
    async createNotification(payload: CreateNotificationPayload): Promise<any> {
        try {
            const notification = await prisma.notification.create({
                data: {
                    universityId: payload.universityId,
                    universityId:  recipientId: payload.userId, // Remplacer userId par recipientId

                    title: payload.title,
                    message: payload.message,
                    isRead: false,
                } as any,
            });

            logger.info(`Notification created for university ${payload.universityId}`, { notificationId: notification.id });
            return notification;
        } catch (error) {
            logger.error('Failed to create notification', { error });
            throw error;
        }
    }

    async getNotifications(universityId: string, limit = 50, offset = 0): Promise<any[]> {
        try {
            return await prisma.notification.findMany({
                where: { universityId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            });
        } catch (error) {
            logger.error('Failed to fetch notifications', { error });
            throw error;
        }
    }

    async markAsRead(notificationId: string): Promise<any> {
        try {
            return await prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true },
            });
        } catch (error) {
            logger.error('Failed to mark notification as read', { error });
            throw error;
        }
    }

    async notifyUniversityOfCertificateIssued(universityId: string, studentName: string, certificateCount: number): Promise<void> {
        await this.createNotification({
            universityId,
            title: `${certificateCount} diplôme(s) émis`,
            message: `${studentName} a reçu son diplôme. Consultez votre tableau de bord pour plus de détails.`,
            category: NotificationCategory.SYSTEM,
        });
    }

    async notifyPaymentReceived(universityId: string, amount: number, studentName: string): Promise<void> {
        await this.createNotification({
            universityId,
            title: `Paiement reçu: ${amount} FCFA`,
            message: `Paiement de ${amount} FCFA reçu de ${studentName} pour un diplôme.`,
            category: NotificationCategory.FINANCIAL,
        });
    }

    async notifySecurityAlert(universityId: string, alertMessage: string): Promise<void> {
        await this.createNotification({
            universityId,
            title: 'Alerte de sécurité',
            message: alertMessage,
            category: NotificationCategory.SECURITY,
        });
    }
}

export const notificationService = new NotificationService();
