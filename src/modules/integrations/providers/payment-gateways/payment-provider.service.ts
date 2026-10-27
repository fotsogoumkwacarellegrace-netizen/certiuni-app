import { Injectable, Logger } from '@nestjs/common';

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

@Injectable()
export class PaymentProviderService {
    private readonly logger = new Logger(PaymentProviderService.name);

    async processPayment(params: PaymentChargeParams): Promise<PaymentChargeResponse> {
        this.logger.log(
            `[PaymentGateway] Traitement du paiement ${params.amount} ${params.currency} via ${params.provider}`,
        );

        const ref = `TXN-${params.provider}-${Date.now()}`;

        return {
            success: true,
            transactionRef: ref,
            status: 'SUCCESSFUL',
            message: 'Transaction traitée avec succès.',
        };
    }
}