export declare enum BatchType {
    STUDENTS_IMPORT = "STUDENTS_IMPORT",
    DIPLOMAS_IMPORT = "DIPLOMAS_IMPORT",
    REQUESTS_IMPORT = "REQUESTS_IMPORT"
}
export declare class UploadBatchDto {
    batchType: BatchType;
    institutionId: string;
    description?: string;
}
