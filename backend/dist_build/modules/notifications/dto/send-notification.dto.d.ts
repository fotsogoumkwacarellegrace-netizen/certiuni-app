export declare enum NotificationType {
    EMAIL = "EMAIL",
    IN_APP = "IN_APP",
    BOTH = "BOTH"
}
export declare class SendNotificationDto {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
}
