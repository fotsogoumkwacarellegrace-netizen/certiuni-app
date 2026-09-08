export declare enum ServiceRequestStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class UpdateRequestStatusDto {
    status: ServiceRequestStatus;
    adminNotes?: string;
}
