export interface AiProvider {
    readonly configured: boolean;
    extractDiplomaData(fileBuffer: Buffer): Promise<{
        studentName?: string;
        matricule?: string;
        degreeName?: string;
        issueDate?: string;
        confidenceScore: number;
        rawText: string;
    }>;
}
