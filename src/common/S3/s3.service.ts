import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private readonly s3Client: S3Client;
    private readonly bucket: string;

    constructor(private readonly configService: ConfigService) {
        const s3Config = this.configService.get('s3');
        this.bucket = s3Config.bucket;
        this.s3Client = new S3Client(s3Config.clientConfig);
    }

    /**
     * Téléverse un fichier (Buffer) vers le bucket S3
     */
    async uploadFile(key: string, body: Buffer, mimeType: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: mimeType,
        });

        await this.s3Client.send(command);
        return key;
    }

    /**
     * Génère une URL pré-signée temporaire pour télécharger un fichier sécurisé
     */
    async getPresignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    }
}