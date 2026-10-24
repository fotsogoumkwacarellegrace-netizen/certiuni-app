import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import { env } from '../../../../config/env.config';
import { PaymentProvider } from './payment-provider.interface';

@Injectable()
export class StripePaymentProvider implements PaymentProvider {
    private readonly client?: Stripe;

    constructor() {
        if (env.STRIPE_SECRET_KEY) {
            this.client = new Stripe(env.STRIPE_SECRET_KEY);
        }
    }

    get configured(): boolean {
        return Boolean(this.client && env.STRIPE_WEBHOOK_SECRET && env.APP_URL);
    }

    get mode(): 'test' | 'live' | 'unconfigured' {
        if (!env.STRIPE_SECRET_KEY) {
            return 'unconfigured';
        }
        return env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? 'test' : 'live';
    }

    async createCheckoutSession(
        params: Stripe.Checkout.SessionCreateParams,
        idempotencyKey: string,
    ): Promise<Stripe.Checkout.Session> {
        return this.requireClient().checkout.sessions.create(params, { idempotencyKey });
    }

    async retrieveCheckoutSession(id: string): Promise<Stripe.Checkout.Session> {
        return this.requireClient().checkout.sessions.retrieve(id);
    }

    constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
        const secret = env.STRIPE_WEBHOOK_SECRET;
        if (!this.configured || !secret) {
            throw new ServiceUnavailableException({
                error: 'not_configured',
                feature: 'stripe',
            });
        }
        return this.requireClient().webhooks.constructEvent(payload, signature, secret);
    }

    async verifyConnection(): Promise<void> {
        if (!this.configured) {
            throw new ServiceUnavailableException({
                error: 'not_configured',
                feature: 'stripe',
            });
        }
        const client = this.requireClient();
        await client.balance.retrieve();

        if (this.mode === 'test') {
            const appUrl = env.APP_URL;
            if (!appUrl) {
                throw new ServiceUnavailableException({
                    error: 'not_configured',
                    feature: 'stripe-checkout-redirects',
                });
            }
            const session = await client.checkout.sessions.create(
                {
                    mode: 'payment',
                    line_items: [{
                        price_data: {
                            currency: 'xaf',
                            product_data: { name: 'Integration verification' },
                            unit_amount: 1000,
                        },
                        quantity: 1,
                    }],
                    success_url: `${appUrl}/integration-check`,
                    cancel_url: `${appUrl}/integration-check`,
                },
                { idempotencyKey: `integration-check-${randomUUID()}` },
            );

            if (!session.url) {
                throw new Error('Stripe did not return a Checkout URL');
            }
            if (session.status === 'open') {
                await client.checkout.sessions.expire(session.id);
            }
        }
    }

    private requireClient(): Stripe {
        if (!this.client) {
            throw new ServiceUnavailableException({
                error: 'not_configured',
                feature: 'stripe',
            });
        }
        return this.client;
    }
}
