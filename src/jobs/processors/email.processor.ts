import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EMAIL_QUEUE_NAME, EmailJobPayload } from '../queues/email.queue';
import { EmailService } from '../../services/email.service';

@Processor(EMAIL_QUEUE_NAME)
export class EmailProcessor extends WorkerHost {
    private readonly logger = new Logger(EmailProcessor.name);

    constructor(private readonly emailService: EmailService) {
        super();
    }

    async process(job: Job<EmailJobPayload>): Promise<any> {
        this.logger.log(`[Worker Email] Envoi en cours pour la tâche #${job.id} vers ${job.data.to}`);

        try {
            const { to, subject, context, attachments } = job.data;
            const html = typeof context.html === 'string'
                ? context.html
                : JSON.stringify(context);

            await this.emailService.sendEmail({
                to,
                subject,
                html,
                attachments,
            });

            this.logger.log(`[Worker Email] Message délivré avec succès à ${job.data.to}`);
            return { success: true, recipient: job.data.to };
        } catch (error : any) {
            this.logger.error(`[Worker Email] Échec: ${error.message}`, error.stack);
            throw error;
        }
    }
}