export declare enum NotificationCategory {
    FINANCIAL = "FINANCIAL",
    SYSTEM = "SYSTEM",
    SECURITY = "SECURITY"
}
export interface CreateNotificationPayload {
    universityId: string;
    title: string;
    message: string;
    category: NotificationCategory;
}
export declare class NotificationService {
    createNotification(payload: CreateNotificationPayload): Promise<any>;
    getNotifications(universityId: string, limit?: number, offset?: number): Promise<any[]>;
    markAsRead(notificationId: string): Promise<any>;
    notifyUniversityOfCertificateIssued(universityId: string, studentName: string, certificateCount: number): Promise<void>;
    notifyPaymentReceived(universityId: string, amount: number, studentName: string): Promise<void>;
    notifySecurityAlert(universityId: string, alertMessage: string): Promise<void>;
}
export declare const notificationService: NotificationService;
