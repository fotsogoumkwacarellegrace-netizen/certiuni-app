import { ConfigService } from '@nestjs/config';
import { IStorageService, UploadResult } from './storage.interface';
export declare class R2S3StorageService implements IStorageService {
    private readonly configService;
    private readonly logger;
    private readonly bucketName;
    constructor(configService: ConfigService);
    uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder?: string): Promise<UploadResult>;
    deleteFile(key: string): Promise<void>;
    getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
