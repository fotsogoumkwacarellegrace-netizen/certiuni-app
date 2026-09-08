export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
  mimeType: string;
}

export interface IStorageService {
  uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder?: string,
  ): Promise<UploadResult>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string, expiresInSeconds?: number): Promise<string>;
}