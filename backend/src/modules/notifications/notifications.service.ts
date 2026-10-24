import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    NotificationType,
    SendNotificationDto,
} from './dto/send-notification.dto';
import { ReceiveNotificationDto } from './dto/receive-notification.dto';
import { MAIL_PROVIDER, MailProvider } from '../integrations/providers/mail/mail-provider.interface';

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(MAIL_PROVIDER) private readonly emailService: MailProvider,
    ) { }

    async send(dto: SendNotificationDto) {
        const recipient = await this.prisma.user.findUnique({
            where: { id: dto.userId },
        });

        if (!recipient) {
            throw new NotFoundException(`Utilisateur destinataire introuvable (#${dto.userId}).`);
        }

        const channelType = dto.type || NotificationType.IN_APP;

        if (channelType === NotificationType.EMAIL || channelType === NotificationType.BOTH) {
            await this.emailService.sendEmail({
                to: recipient.email,
                subject: dto.title,
                html: dto.message,
            });
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
    async findAllForUser(userId: string, query?: ReceiveNotificationDto) {
        const { isRead, type, limit = 20, offset = 0 } = query || {};

        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(isRead !== undefined && { isRead }),
                ...(type && { type }),
            },
            take: limit,
            skip: offset,
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
}