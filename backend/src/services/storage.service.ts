import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env.config';

const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    ...(env.S3_ENDPOINT && {
        endpoint: env.S3_ENDPOINT,
        forcePathStyle: true,
    }),
});

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

    return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
};