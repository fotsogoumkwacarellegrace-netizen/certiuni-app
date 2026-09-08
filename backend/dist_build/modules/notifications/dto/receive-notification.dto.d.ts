import { NotificationType } from './send-notification.dto';
export declare class ReceiveNotificationDto {
    isRead?: boolean;
    type?: NotificationType;
    limit?: number;
    offset?: number;
}
