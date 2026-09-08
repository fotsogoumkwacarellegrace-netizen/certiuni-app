"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCertificatePdfFromS3 = exports.getPresignedDownloadUrl = exports.uploadCertificatePdfToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'eu-west-3',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    ...(process.env.S3_ENDPOINT && {
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
    }),
});
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'certiuni-certificates';
const uploadCertificatePdfToS3 = async (pdfBuffer, publicIdentifier) => {
    const fileKey = `certificates/${new Date().getFullYear()}/${publicIdentifier}.pdf`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
        ContentDisposition: `inline; filename="Diplome_${publicIdentifier}.pdf"`,
        Metadata: {
            publicIdentifier,
            generatedAt: new Date().toISOString(),
        },
    });
    try {
        await s3Client.send(command);
        const fileUrl = process.env.S3_ENDPOINT
            ? `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${fileKey}`
            : `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-west-3'}.amazonaws.com/${fileKey}`;
        return { fileKey, fileUrl };
    }
    catch (error) {
        console.error('Erreur lors du téléversement vers S3 :', error);
        throw new Error('Impossible d\'enregistrer le fichier PDF sur le stockage cloud.');
    }
};
exports.uploadCertificatePdfToS3 = uploadCertificatePdfToS3;
const getPresignedDownloadUrl = async (fileKey, expiresIn = 3600) => {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
    });
    return await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn });
};
exports.getPresignedDownloadUrl = getPresignedDownloadUrl;
const deleteCertificatePdfFromS3 = async (fileKey) => {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
    });
    await s3Client.send(command);
};
exports.deleteCertificatePdfFromS3 = deleteCertificatePdfFromS3;
//# sourceMappingURL=s3.service.js.map