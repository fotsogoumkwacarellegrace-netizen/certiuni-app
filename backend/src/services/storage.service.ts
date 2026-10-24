import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ServiceUnavailableException } from '@nestjs/common';
import { env } from '../config/env.config';

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