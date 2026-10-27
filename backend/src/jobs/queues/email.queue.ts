import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const EMAIL_QUEUE_NAME = 'email-delivery-queue';

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

@Injectable()
export class EmailQueueService {
    private readonly logger = new Logger(EmailQueueService.name);

    constructor(@InjectQueue(EMAIL_QUEUE_NAME) private readonly emailQueue: Queue<EmailJobPayload>) { }

    /**
     * Enfile un email transactionnel pour envoi asynchrone
     */
    async addEmailJob(payload: EmailJobPayload): Promise<string> {
        const job = await this.emailQueue.add('send-transactional-email', payload, {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 3000, // 3s, 6s, 12s, 24s, 48s
            },
            removeOnComplete: { age: 3600 },
            removeOnFail: { age: 86400 * 3 }, // Conserve les échecs 3 jours
        });

        this.logger.log(`Email transactionnel enfilé [ID: ${job.id}] pour ${payload.to}`);
        return job.id as string;
    }
}