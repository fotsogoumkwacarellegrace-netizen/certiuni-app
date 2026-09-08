import { S3ClientConfig } from '@aws-sdk/client-s3';
export interface S3ModuleOptions {
    bucket: string;
    region: string;
    clientConfig: S3ClientConfig;
}
declare const _default: (() => S3ModuleOptions) & import("@nestjs/config").ConfigFactoryKeyHost<S3ModuleOptions>;
export default _default;
