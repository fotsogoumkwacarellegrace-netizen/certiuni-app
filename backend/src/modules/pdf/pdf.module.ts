import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { env } from '../../config/env.config';
import { PdfProcessor } from '../../jobs/processors/pdf.processor';
import { PdfQueueService, PDF_QUEUE_NAME } from '../../jobs/queues/pdf.queue';

@Module({
    imports: [
        // Connexion Redis partagée par les files BullMQ (même client que pdf.queue.ts)
        BullModule.forRoot({
            connection: {
                host: env.REDIS_HOST || 'localhost',
                port: env.REDIS_PORT || 6379,
                password: env.REDIS_PASSWORD,
                db: env.REDIS_DB ?? 0,
            },
        }),
        // Enregistrement de la file de génération PDF
        BullModule.registerQueue({
            name: PDF_QUEUE_NAME,
        }),
    ],
    providers: [PdfProcessor, PdfQueueService],
    exports: [PdfQueueService],
})
export class PdfModule {}
