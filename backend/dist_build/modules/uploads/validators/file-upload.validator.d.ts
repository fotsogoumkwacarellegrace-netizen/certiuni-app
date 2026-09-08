export declare class FileUploadValidator {
    private static readonly MAX_SIZE_BYTES;
    private static readonly ALLOWED_MIME_TYPES;
    static validate(file: Express.Multer.File): void;
}
