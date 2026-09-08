export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    attachments?: any[];
}
export declare class EmailService {
    private transporter;
    sendEmail(payload: EmailPayload): Promise<boolean>;
    sendMagicLinkEmail(email: string, token: string): Promise<boolean>;
    sendCertificateIssuedEmail(email: string, studentName: string, certificateId: string): Promise<boolean>;
    sendPaymentReceiptEmail(email: string, certificateId: string, amount: number, transactionRef: string): Promise<boolean>;
}
export declare const emailService: EmailService;
