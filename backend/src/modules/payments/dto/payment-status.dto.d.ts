export declare enum PaymentStatus {
    PENDING = "PENDING",
    SUCCESSFUL = "SUCCESSFUL",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare class PaymentStatusDto {
    status: PaymentStatus;
    transactionRef?: string;
    note?: string;
}
