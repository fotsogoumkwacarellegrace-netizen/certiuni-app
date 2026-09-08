"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('s3', () => ({
    bucket: process.env.AWS_S3_BUCKET || '',
    region: process.env.AWS_REGION || process.env.AWS_S3_REGION || 'us-east-1',
    clientConfig: {
        region: process.env.AWS_REGION || process.env.AWS_S3_REGION || 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.AWS_S3_ENDPOINT || process.env.S3_ENDPOINT || undefined,
        forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true' || !!process.env.S3_ENDPOINT,
    },
}));
//# sourceMappingURL=s3.config.js.map