import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ServiceUnavailableException, Logger } from '@nestjs/common';
import { env } from '../config/env.config';

const storageLogger = new Logger('StorageService');

const getS3Client = (): S3Client => {
    if (
        !env.AWS_REGION ||
        !env.AWS_ACCESS_KEY_ID ||
        !env.AWS_SECRET_ACCESS_KEY ||
        !env.AWS_S3_BUCKET
    ) {
        throw new ServiceUnavailableException({
            error: 'not_configured',
            feature: 'storage',
        });
    }

    return new S3Client({
        region: env.AWS_REGION,
        credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
        ...(env.AWS_S3_ENDPOINT && {
            endpoint: env.AWS_S3_ENDPOINT,
            forcePathStyle: true,
        }),
    });
};

/**
 * Génère une URL pré-signée S3 temporaire pour la lecture/téléchargement du PDF
 */
export const getPresignedDownloadUrl = async (
    fileKey: string,
    expiresInSeconds = 900
): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: fileKey,
    });

    return await getSignedUrl(getS3Client(), command, { expiresIn: expiresInSeconds });
};

/**
 * Construit l'URL publique d'accès à un objet S3 (direct ou via endpoint custom).
 */
const buildPublicObjectUrl = (fileKey: string): string => {
    if (env.AWS_S3_ENDPOINT) {
        return `${env.AWS_S3_ENDPOINT.replace(/\/$/, '')}/${env.AWS_S3_BUCKET}/${fileKey}`;
    }
    return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;
};

/**
 * Téléverse un buffer PDF vers le bucket S3/MinIO et retourne la clé + l'URL d'accès.
 * Lève une ServiceUnavailableException si le stockage n'est pas configuré.
 */
export const uploadCertificatePdfToS3 = async (
    buffer: Buffer,
    publicIdentifier: string,
): Promise<{ fileKey: string; fileUrl: string }> => {
    if (!env.AWS_S3_BUCKET) {
        throw new ServiceUnavailableException({
            error: 'not_configured',
            feature: 'storage',
            message: 'AWS_S3_BUCKET n\'est pas configuré.',
        });
    }

    const s3 = getS3Client();
    const fileKey = `certificates/${publicIdentifier}.pdf`;

    const command = new PutObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: buffer,
        ContentType: 'application/pdf',
        ContentDisposition: `inline; filename="${publicIdentifier}.pdf"`,
    });

    try {
        await s3.send(command);
        const fileUrl = buildPublicObjectUrl(fileKey);
        storageLogger.log(`PDF téléversé sur S3 : ${fileKey} (${Math.round(buffer.length / 1024)} Ko)`);
        return { fileKey, fileUrl };
    } catch (error: any) {
        storageLogger.error(`Échec du téléversement S3 pour ${fileKey}: ${error.message}`, error.stack);
        throw new ServiceUnavailableException({
            error: 'storage_upload_failed',
            feature: 'storage',
            message: `Impossible de téléverser le PDF sur le stockage : ${error.message}`,
        });
    }
};