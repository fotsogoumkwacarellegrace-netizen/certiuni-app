export declare enum PaymentProvider {
    MTN_MOMO = "MTN_MOMO",
    ORANGE_MONEY = "ORANGE_MONEY",
    STRIPE = "STRIPE",
    CREDIT_CARD = "CREDIT_CARD",
    CASH = "CASH"
}
export declare class InitiatePaymentDto {
    requestId: string;
    amount: number;
    provider: PaymentProvider;
    phoneNumber?: string;
}
