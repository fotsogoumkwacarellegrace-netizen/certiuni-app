import { Job } from 'bullmq';
import { WorkerHost } from '@nestjs/bullmq';
import { PdfJobPayload } from '../queues/pdf.queue';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PdfProcessor extends WorkerHost {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    process(job: Job<PdfJobPayload>): Promise<any>;
}
