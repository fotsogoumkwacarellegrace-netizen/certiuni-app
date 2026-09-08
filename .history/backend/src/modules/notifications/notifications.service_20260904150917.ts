import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    NotificationType,
    SendNotificationDto,
} from './dto/send-notification.dto';


@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) { }

    async send(dto: SendNotificationDto) {
        const recipient = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });

        if (!recipient) {
            throw new NotFoundException(`Utilisateur destinataire introuvable (#${dto.userId}).`);
        }

        const channelType = dto.type || NotificationType.IN_APP;

        if (channelType === NotificationType.EMAIL || channelType === NotificationType.BOTH) {
            await this.sendEmail(recipient.email, dto.title, dto.message);
        }

        return this.prisma.notification.create({
            data: {
                userId: dto.userId,
                title: dto.title.trim(),
                message: dto.message.trim(),
                type: channelType,
                isRead: false,
            },
        });
    }

    async findAllForUser(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async markAsRead(id: string, userId: string) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            throw new NotFoundException(`Notification introuvable (#${id}).`);
        }

        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }

    private async sendEmail(email: string, title: string, message: string) {
        // Intégration du service SMTP / Nodemailer / SendGrid / Resend
        // Log de simulation d'envoi en environnement de développement
        console.log(`[Email Envoyé] À: ${email} | Sujet: ${title} | Contenu: ${message}`);
    }
}