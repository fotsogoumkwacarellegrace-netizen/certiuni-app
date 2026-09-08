import { Queue } from 'bullmq';
export declare const EMAIL_QUEUE_NAME = "email-delivery-queue";
export interface EmailJobPayload {
    to: string;
    subject: string;
    template: 'certificate-issued' | 'verification-code' | 'account-welcome';
    context: Record<string, any>;
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: Buffer | string;
    }>;
}
export declare class EmailQueueService {
    private readonly emailQueue;
    private readonly logger;
    constructor(emailQueue: Queue<EmailJobPayload>);
    addEmailJob(payload: EmailJobPayload): Promise<string>;
}
