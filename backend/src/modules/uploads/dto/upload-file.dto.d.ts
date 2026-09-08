export declare enum FileCategory {
    DOCUMENT = "DOCUMENT",
    IMAGE = "IMAGE",
    SPREADSHEET = "SPREADSHEET",
    AVATAR = "AVATAR"
}
export declare class UploadFileDto {
    category?: FileCategory;
    description?: string;
}
