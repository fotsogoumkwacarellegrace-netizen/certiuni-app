export declare enum PaymentGateway {
    MOMO = "MOMO",
    ORANGE = "ORANGE",
    CARD = "CARD"
}
export interface ProcessPaymentPayload {
    certificateId: string;
    studentId: string;
    amount: number;
    gateway: PaymentGateway;
    phoneNumber?: string;
    cardToken?: string;
}
export declare class PaymentService {
    private readonly BASE_AMOUNT;
    processPayment(payload: ProcessPaymentPayload): Promise<any>;
    getPaymentByReference(reference: string): Promise<any>;
    getStudentPaymentHistory(studentId: string, limit?: number, offset?: number): Promise<any[]>;
    private _generateTransactionReference;
    private _callPaymentGateway;
    getRequiredAmount(): number;
}
export declare const paymentService: PaymentService;
