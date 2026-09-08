import { BatchService } from './batch.service';
import { UploadBatchDto } from './dto/upload-batch.dto';
export declare class BatchController {
    private readonly batchService;
    constructor(batchService: BatchService);
    uploadBatch(file: Express.Multer.File, dto: UploadBatchDto, req: any): Promise<{
        batchType: import("./dto/upload-batch.dto").BatchType;
        institutionId: string;
        totalRows: number;
        validRowsCount: number;
        invalidRowsCount: number;
        details: import("./batch.service").BatchItemResult[];
    }>;
}
