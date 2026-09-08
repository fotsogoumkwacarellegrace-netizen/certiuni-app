import { PrismaService } from '../prisma/prisma.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { ReceiveNotificationDto } from './dto/receive-notification.dto';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    send(dto: SendNotificationDto): Promise<{
        message: string;
        type: string;
        title: string | null;
        id: string;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isRead: boolean;
    }>;
    findAllForUser(userId: string, query?: ReceiveNotificationDto): Promise<{
        message: string;
        type: string;
        title: string | null;
        id: string;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string, userId: string): Promise<{
        message: string;
        type: string;
        title: string | null;
        id: string;
        universityId: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    private sendEmail;
}
