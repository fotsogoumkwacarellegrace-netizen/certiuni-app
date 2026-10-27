import { registerAs } from '@nestjs/config';
import { S3ClientConfig } from '@aws-sdk/client-s3';

export interface S3ModuleOptions {
    bucket: string;
    region: string;
    clientConfig: S3ClientConfig;
}

export default registerAs(
    's3',
    (): S3ModuleOptions => ({
        bucket: process.env.AWS_S3_BUCKET || '',
        region: process.env.AWS_REGION || process.env.AWS_S3_REGION || 'us-east-1',
        clientConfig: {
            region: process.env.AWS_REGION || process.env.AWS_S3_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
            // Utile pour le développement local (ex: MinIO, LocalStack)
            endpoint: process.env.AWS_S3_ENDPOINT || process.env.S3_ENDPOINT || undefined,
            forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true' || !!process.env.S3_ENDPOINT,
        },
    }),
);