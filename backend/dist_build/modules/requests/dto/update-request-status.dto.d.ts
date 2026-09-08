export declare enum RequestStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class UpdateRequestStatusDto {
    status: RequestStatus;
    adminNotes?: string;
}
