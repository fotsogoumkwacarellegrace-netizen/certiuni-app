export interface OcrExtractionResult {
    studentName?: string;
    matricule?: string;
    degreeName?: string;
    issueDate?: string;
    confidenceScore: number;
    rawText: string;
}
export declare class AiService {
    private readonly logger;
    extractDiplomaData(fileBuffer: Buffer): Promise<OcrExtractionResult>;
}
