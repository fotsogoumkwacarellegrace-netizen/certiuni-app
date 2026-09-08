import { Queue } from 'bullmq';
import { redisClient } from '../../config/redis';
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';


export interface PdfJobData {
    certificateId: string;
    publicIdentifier: string;
    studentName: string;
    degreeTitle: string;
    fieldOfStudy: string;
    grade?: string;
    issueDate: string;
    universityName: string;
    universityLogoUrl?: string;
    canonicalHash: string;
    verificationUrl: string;
    documentNumber: string;
    universityId: string;
}

export const PDF_QUEUE_NAME = 'pdf-generation-queue';

// Configuration de la file BullMQ adossée à Redis
export const pdfQueue = new Queue<PdfJobData>(PDF_QUEUE_NAME, {
    connection: redisClient,
    defaultJobOptions: {
        attempts: 3, // Reprendre 3 fois en cas d'échec
        backoff: {
            type: 'exponential',
            delay: 5000, // Attendre 5s, 10s, 20s...
        },
        removeOnComplete: { age: 86400, count: 1000 }, // Conserver 24h ou 1000 jobs max
        removeOnFail: { age: 604800 }, // Conserver les échecs 7 jours pour inspection
    },
});

/**
 * Envoie un travail de génération de PDF dans la file d'attente
 */
export const addPdfJobToQueue = async (data: PdfJobData): Promise<string> => {
    const job = await pdfQueue.add(`pdf-${data.publicIdentifier}`, data, {
        jobId: `job-pdf-${data.certificateId}`,
    });
    return job.id || '';
};

@Injectable()
export class PdfQueueService {
    private readonly logger = new Logger(PdfQueueService.name);

    constructor(@InjectQueue(PDF_QUEUE_NAME) private readonly pdfQueue: Queue<PdfJobPayload>) { }

    /**
     * Ajoute une tâche de génération asynchrone de PDF dans la file BullMQ
     */
    async addPdfGenerationJob(payload: PdfJobPayload): Promise<string> {
        const job = await this.pdfQueue.add('generate-certificate-pdf', payload, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000, // 2s, 4s, 8s
            },
            removeOnComplete: { age: 3600 }, // Garde les logs d'achèvement 1h
            removeOnFail: { age: 86400 },    // Garde les échecs 24h
        });

        this.logger.log(`Tâche de génération PDF enfilée [ID: ${job.id}] pour le diplôme ${payload.documentNumber}`);
        return job.id as string;
    }
}