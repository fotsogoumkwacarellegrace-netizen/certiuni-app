export interface PaymentChargeParams {
    amount: number;
    currency: string;
    provider: 'MTN_MOMO' | 'ORANGE_MONEY' | 'STRIPE';
    phoneNumber?: string;
    description?: string;
}
export interface PaymentChargeResponse {
    success: boolean;
    transactionRef: string;
    status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
    message: string;
}
export declare class PaymentProviderService {
    private readonly logger;
    processPayment(params: PaymentChargeParams): Promise<PaymentChargeResponse>;
}
