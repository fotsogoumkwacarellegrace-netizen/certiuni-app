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