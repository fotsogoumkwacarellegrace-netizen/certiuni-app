import Stripe from 'stripe';

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');

export interface PaymentProvider {
    readonly configured: boolean;
    readonly mode: 'test' | 'live' | 'unconfigured';
    createCheckoutSession(
        params: Stripe.Checkout.SessionCreateParams,
        idempotencyKey: string,
    ): Promise<Stripe.Checkout.Session>;
    retrieveCheckoutSession(id: string): Promise<Stripe.Checkout.Session>;
    constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event;
    verifyConnection(): Promise<void>;
}
