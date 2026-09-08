import { UploadFileDto } from './dto/upload-file.dto';
export declare class UploadsService {
    private readonly logger;
    constructor();
    processAndUpload(file: Express.Multer.File, dto?: UploadFileDto, folder?: string): Promise<{
        key: string;
        url: string;
        originalName: string;
        mimeType: string;
        size: number;
        category: import("./dto/upload-file.dto").FileCategory | undefined;
        description: string | undefined;
    }>;
}
