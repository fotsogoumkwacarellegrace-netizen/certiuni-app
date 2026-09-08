import { ConfigService } from '@nestjs/config';
export interface UploadedFileResponse {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    key: string;
    url: string;
}
export declare class FilesService {
    private readonly configService;
    private s3Client;
    private bucketName;
    constructor(configService: ConfigService);
    private generateFileKey;
    uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadedFileResponse>;
    getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
    deleteFile(key: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
