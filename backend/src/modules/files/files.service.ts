import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';
import { env } from '../../config/env.config';

export interface UploadedFileResponse {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    key: string;
    url: string;
}

@Injectable()
export class FilesService {
    private readonly s3Client?: S3Client;
    private readonly bucketName?: string;

    constructor() {
        const {
            AWS_REGION,
            AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY,
            AWS_S3_BUCKET,
            AWS_S3_ENDPOINT,
        } = env;
        if (
            AWS_REGION &&
            AWS_ACCESS_KEY_ID &&
            AWS_SECRET_ACCESS_KEY &&
            AWS_S3_BUCKET
        ) {
            this.bucketName = AWS_S3_BUCKET;
            this.s3Client = new S3Client({
                region: AWS_REGION,
                endpoint: AWS_S3_ENDPOINT,
                forcePathStyle: Boolean(AWS_S3_ENDPOINT),
                credentials: {
                    accessKeyId: AWS_ACCESS_KEY_ID,
                    secretAccessKey: AWS_SECRET_ACCESS_KEY,
                },
            });
        }
    }

    private getStorage(): { client: S3Client; bucket: string } {
        if (!this.s3Client || !this.bucketName) {
            throw new HttpException(
                { error: 'not_configured', feature: 'storage' },
                501,
            );
        }
        return { client: this.s3Client, bucket: this.bucketName };
    }

    /**
     * Génère une clé d'objet S3 unique à partir du nom d'origine et du dossier
     */
    private generateFileKey(originalName: string, folder: string = 'uploads'): string {
        const ext = path.extname(originalName);
        const hash = crypto.randomBytes(16).toString('hex');
        const sanitizedFolder = folder.replace(/^\/+|\/+$/g, '');
        return `${sanitizedFolder}/${Date.now()}-${hash}${ext}`;
    }

    async uploadFile(file: Express.Multer.File, folder?: string): Promise<UploadedFileResponse> {
        if (!file) {
            throw new BadRequestException('Aucun fichier n\'a été fourni.');
        }

        const { client, bucket } = this.getStorage();
        const key = this.generateFileKey(file.originalname, folder);

        try {
            await client.send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }),
            );

            const url = await getSignedUrl(
                client,
                new GetObjectCommand({ Bucket: bucket, Key: key }),
                { expiresIn: 3600 },
            );

            return {
                filename: path.basename(key),
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                key,
                url,
            };
        } catch {
            throw new InternalServerErrorException('Échec du stockage du fichier sur S3/MinIO.');
        }
    }

    async getPresignedDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
        const { client, bucket } = this.getStorage();
        try {
            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            return await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
        } catch {
            throw new InternalServerErrorException('Impossible de générer l’URL de téléchargement.');
        }
    }

    async deleteFile(key: string): Promise<{ success: boolean; message: string }> {
        const { client, bucket } = this.getStorage();
        try {
            await client.send(
                new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: key,
                }),
            );

            return {
                success: true,
                message: 'Le fichier a été supprimé du stockage avec succès.',
            };
        } catch {
            throw new InternalServerErrorException('Erreur lors de la suppression du fichier du stockage.');
        }
    }
}