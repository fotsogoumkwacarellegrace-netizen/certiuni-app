import { registerAs } from '@nestjs/config';
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { env } from './env.config';

export interface S3ModuleOptions {
    bucket: string;
    region: string;
    clientConfig: S3ClientConfig;
}

export default registerAs(
    's3',
    (): S3ModuleOptions => ({
        bucket: env.AWS_S3_BUCKET,
        region: env.AWS_REGION,
        clientConfig: {
            region: env.AWS_REGION,
            credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            },
            // Utile pour le développement local (ex: MinIO, LocalStack)
            endpoint: env.S3_ENDPOINT || undefined,
            forcePathStyle: !!env.S3_ENDPOINT, // Requis si utilisation de MinIO
        },
    }),
);