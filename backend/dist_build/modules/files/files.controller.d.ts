import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File, dto: UploadFileDto): Promise<import("./files.service").UploadedFileResponse>;
    getPresignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
