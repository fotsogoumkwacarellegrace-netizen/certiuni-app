import { PrismaService } from '../../prisma/prisma.service';
import { UploadBatchDto, BatchType } from './dto/upload-batch.dto';
export interface BatchItemResult {
    rowNumber: number;
    data: Record<string, any>;
    isValid: boolean;
    errors?: string[];
}
export declare class BatchService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processBatchUpload(file: Express.Multer.File, dto: UploadBatchDto, userId: string): Promise<{
        batchType: BatchType;
        institutionId: string;
        totalRows: number;
        validRowsCount: number;
        invalidRowsCount: number;
        details: BatchItemResult[];
    }>;
    private validateRow;
}
