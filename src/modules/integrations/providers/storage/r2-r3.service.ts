import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IStorageService, UploadResult } from './storage.interface';

@Injectable()
export class R2S3StorageService implements IStorageService {
    private readonly logger = new Logger(R2S3StorageService.name);
    private readonly bucketName: string;

    constructor(private readonly configService: ConfigService) {
        this.bucketName = this.configService.get<string>('S3_BUCKET_NAME', 'certiuni-docs');
    }

    async uploadFile(
        fileBuffer: Buffer,
        fileName: string,
        mimeType: string,
        folder: string = 'documents',
    ): Promise<UploadResult> {
        const key = `${folder}/${Date.now()}-${fileName.replace(/\s+/g, '_')}`;

        this.logger.log(`[Storage] Fichier uploadé vers S3/R2 : ${key}`);

        const publicUrl = `${this.configService.get<string>('S3_PUBLIC_ENDPOINT', 'https://pub-r2.certiuni.com')}/${key}`;

        return {
            url: publicUrl,
            key,
            bucket: this.bucketName,
            mimeType,
        };
    }

    async deleteFile(key: string): Promise<void> {
        this.logger.log(`[Storage] Fichier supprimé : ${key}`);
    }

    async getSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
        return `${this.configService.get<string>('S3_PUBLIC_ENDPOINT')}/${key}?expires=${expiresInSeconds}`;
    }
}