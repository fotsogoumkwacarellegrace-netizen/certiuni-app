import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailJobPayload } from '../queues/email.queue';
import { EmailService } from '../../services/email.service';
export declare class EmailProcessor extends WorkerHost {
    private readonly emailService;
    private readonly logger;
    constructor(emailService: EmailService);
    process(job: Job<EmailJobPayload>): Promise<any>;
}
