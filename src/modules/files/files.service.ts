import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';

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
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private readonly configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
        const endpoint = this.configService.get<string>('S3_ENDPOINT');

        this.bucketName = this.configService.get<string>('S3_BUCKET_NAME', 'certiuni-bucket');

        this.s3Client = new S3Client({
            region,
            endpoint: endpoint || undefined,
            forcePathStyle: !!endpoint, // Requis pour la compatibilité MinIO
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
            },
        });
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

        const key = this.generateFileKey(file.originalname, folder);

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }),
            );

            const publicBaseUrl = this.configService.get<string>('S3_PUBLIC_URL');
            const url = publicBaseUrl
                ? `${publicBaseUrl.replace(/\/+$/, '')}/${key}`
                : `https://${this.bucketName}.s3.amazonaws.com/${key}`;

            return {
                filename: path.basename(key),
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                key,
                url,
            };
        } catch (error: any) {
            throw new InternalServerErrorException(
                `Échec du stockage du fichier sur S3/MinIO: ${error.message}`,
            );
        }
    }

    async getPresignedDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
        } catch (error: any) {
            throw new NotFoundException(`Impossible de générer l'URL de téléchargement pour "${key}".`);
        }
    }

    async deleteFile(key: string): Promise<{ success: boolean; message: string }> {
        try {
            await this.s3Client.send(
                new DeleteObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                }),
            );

            return {
                success: true,
                message: `Le fichier "${key}" a été supprimé du stockage avec succès.`,
            };
        } catch (error: any) {
            throw new InternalServerErrorException(
                `Erreur lors de la suppression du fichier "${key}": ${error.message}`,
            );
        }
    }
}