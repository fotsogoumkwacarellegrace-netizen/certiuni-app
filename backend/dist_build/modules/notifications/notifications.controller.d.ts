import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { ReceiveNotificationDto } from './dto/receive-notification.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
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
    findMyNotifications(req: any, query: ReceiveNotificationDto): Promise<{
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
    markAsRead(id: string, req: any): Promise<{
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
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
