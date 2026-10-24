export interface StorageProvider {
    readonly configured: boolean;
    uploadFile(
        fileBuffer: Buffer,
        fileName: string,
        mimeType: string,
        folder?: string,
    ): Promise<{ url: string; key: string; bucket: string; mimeType: string }>;
    deleteFile(key: string): Promise<void>;
    getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
