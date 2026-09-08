import { UploadsService } from './uploads.service';
import { UploadFileDto } from './dto/upload-file.dto';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(file: Express.Multer.File, dto: UploadFileDto): Promise<{
        key: string;
        url: string;
        originalName: string;
        mimeType: string;
        size: number;
        category: import("./dto/upload-file.dto").FileCategory;
        description: string;
    }>;
}
