import { Injectable, Logger } from '@nestjs/common';

export interface OcrExtractionResult {
    studentName?: string;
    matricule?: string;
    degreeName?: string;
    issueDate?: string;
    confidenceScore: number;
    rawText: string;
}

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);

    async extractDiplomaData(fileBuffer: Buffer): Promise<OcrExtractionResult> {
        this.logger.log('[AI/OCR] Traitement de l image/document du diplôme...');

        return {
            studentName: 'KOUAM Jean-Paul',
            matricule: 'CM-UFD-2026-0891',
            degreeName: 'Licence en Informatique Fondamentale',
            issueDate: '2026-07-15',
            confidenceScore: 0.96,
            rawText: 'REPUBLIQUE DU CAMEROUN - ATTESTATION DE REUSSITE - KOUAM Jean-Paul...',
        };
    }
}