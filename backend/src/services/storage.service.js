"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPresignedDownloadUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const env_config_1 = require("../config/env.config");
const s3Client = new client_s3_1.S3Client({
    region: env_config_1.env.AWS_REGION,
    credentials: {
        accessKeyId: env_config_1.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env_config_1.env.AWS_SECRET_ACCESS_KEY,
    },
    ...(env_config_1.env.S3_ENDPOINT && {
        endpoint: env_config_1.env.S3_ENDPOINT,
        forcePathStyle: true,
    }),
});
const getPresignedDownloadUrl = async (fileKey, expiresInSeconds = 900) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: env_config_1.env.AWS_S3_BUCKET,
        Key: fileKey,
    });
    return await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: expiresInSeconds });
};
exports.getPresignedDownloadUrl = getPresignedDownloadUrl;
//# sourceMappingURL=storage.service.js.map