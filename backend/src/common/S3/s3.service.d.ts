import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private readonly configService;
    private readonly s3Client;
    private readonly bucket;
    constructor(configService: ConfigService);
    uploadFile(key: string, body: Buffer, mimeType: string): Promise<string>;
    getPresignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
