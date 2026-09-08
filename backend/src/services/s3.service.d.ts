export declare const uploadCertificatePdfToS3: (pdfBuffer: Buffer, publicIdentifier: string) => Promise<{
    fileKey: string;
    fileUrl: string;
}>;
export declare const getPresignedDownloadUrl: (fileKey: string, expiresIn?: number) => Promise<string>;
export declare const deleteCertificatePdfFromS3: (fileKey: string) => Promise<void>;
