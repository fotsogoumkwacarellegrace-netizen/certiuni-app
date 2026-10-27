import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadBatchDto, BatchType } from './dto/upload-batch.dto';
import * as xlsx from 'xlsx';

export interface BatchItemResult {
    rowNumber: number;
    data: Record<string, any>;
    isValid: boolean;
    errors?: string[];
}

@Injectable()
export class BatchService {
    private readonly logger = new Logger(BatchService.name);

    constructor(private readonly prisma: PrismaService) { }

    async processBatchUpload(
        file: Express.Multer.File,
        dto: UploadBatchDto,
        userId: string,
    ) {
        if (!file) {
            throw new BadRequestException('Aucun fichier fourni pour l\'importation.');
        }

        // 1. Parsing du fichier Excel / CSV
        let rows: Record<string, any>[] = [];
        try {
            const workbook = xlsx.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
        } catch (error: any) {
            throw new BadRequestException(`Erreur lors de la lecture du fichier : ${error.message}`);
        }

        if (rows.length === 0) {
            throw new BadRequestException('Le fichier d\'importation est vide.');
        }

        // 2. Validation ligne par ligne selon le BatchType
        const results: BatchItemResult[] = [];
        let validCount = 0;
        let invalidCount = 0;

        for (let index = 0; index < rows.length; index++) {
            const rowData = rows[index];
            const rowErrors = this.validateRow(rowData, dto.batchType);

            const isValid = rowErrors.length === 0;
            if (isValid) validCount++;
            else invalidCount++;

            results.push({
                rowNumber: index + 2, // Compte tenu de la ligne d'en-tête (Header)
                data: rowData,
                isValid,
                ...(rowErrors.length > 0 && { errors: rowErrors }),
            });
        }

        // 3. Traitement synchrone des lignes valides (ou envoi vers File d'attente/Queue)
        const processedRows = results.filter((item) => item.isValid);

        this.logger.log(
            `[Batch] Lot ${dto.batchType} traité par l'utilisateur #${userId}. Succès: ${validCount}, Échecs: ${invalidCount}`,
        );

        return {
            batchType: dto.batchType,
            institutionId: dto.institutionId,
            totalRows: rows.length,
            validRowsCount: validCount,
            invalidRowsCount: invalidCount,
            details: results,
        };
    }

    private validateRow(data: Record<string, any>, batchType: BatchType): string[] {
        const errors: string[] = [];

        if (batchType === BatchType.STUDENTS_IMPORT) {
            if (!data['matricule'] || String(data['matricule']).trim() === '') {
                errors.push('Le matricule est obligatoire.');
            }
            if (!data['firstName'] || String(data['firstName']).trim() === '') {
                errors.push('Le prénom est obligatoire.');
            }
            if (!data['lastName'] || String(data['lastName']).trim() === '') {
                errors.push('Le nom est obligatoire.');
            }
            if (!data['email'] || !String(data['email']).includes('@')) {
                errors.push('L\'adresse e-mail est absente ou invalide.');
            }
        } else if (batchType === BatchType.DIPLOMAS_IMPORT) {
            if (!data['studentMatricule']) errors.push('Le matricule étudiant est obligatoire.');
            if (!data['diplomaTitle']) errors.push('Le titre du diplôme est obligatoire.');
            if (!data['issueDate']) errors.push('La date de délivrance est obligatoire.');
        }

        return errors;
    }
}