import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EMAIL_QUEUE_NAME, EmailJobPayload } from '../queues/email.queue';
import { MailerService } from '../../mailer/mailer.service';

@Processor(EMAIL_QUEUE_NAME)
export class EmailProcessor extends WorkerHost {
    private readonly logger = new Logger(EmailProcessor.name);

    constructor(private readonly mailerService: MailerService) {
        super();
    }

    async process(job: Job<EmailJobPayload>): Promise<any> {
        this.logger.log(`[Worker Email] Envoi en cours pour la tâche #${job.id} vers ${job.data.to}`);

        try {
            await this.mailerService.sendMail({
                to: job.data.to,
                subject: job.data.subject,
                template: job.data.template,
                context: job.data.context,
                attachments: job.data.attachments,
            });

            this.logger.log(`[Worker Email] Message délivré avec succès à ${job.data.to}`);
            return { success: true, recipient: job.data.to };
        } catch (error) {
            this.logger.error(`[Worker Email] Échec de l'envoi du message à ${job.data.to} - ${error.message}`, error.stack);
            throw error;
        }
    }
}