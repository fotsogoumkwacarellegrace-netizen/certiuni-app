import { Queue } from 'bullmq';
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
export type PdfJobPayload = PdfJobData;
export declare const PDF_QUEUE_NAME = "pdf-generation-queue";
export declare const pdfQueue: Queue<PdfJobData, any, string, PdfJobData, any, string, import("bullmq").RedisQueueBackend>;
export declare const addPdfJobToQueue: (data: PdfJobData) => Promise<string>;
export declare class PdfQueueService {
    private readonly pdfQueue;
    private readonly logger;
    constructor(pdfQueue: Queue<PdfJobPayload>);
    addPdfGenerationJob(payload: PdfJobPayload): Promise<string>;
}
