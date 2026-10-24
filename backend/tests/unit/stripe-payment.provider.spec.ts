import Stripe from 'stripe';
import { env } from '../../src/config/env.config';
import { StripePaymentProvider } from '../../src/modules/integrations/providers/payment-gateways/stripe-payment.provider';

describe('StripePaymentProvider webhook verification', () => {
    const provider = new StripePaymentProvider();

    it('accepts a correctly signed event and rejects an invalid signature', () => {
        const rawBody = Buffer.from(JSON.stringify({
            id: 'evt_unit_test',
            object: 'event',
            api_version: '2025-03-31.basil',
            created: 1,
            data: { object: { id: 'cs_test' } },
            livemode: false,
            pending_webhooks: 1,
            request: { id: null, idempotency_key: null },
            type: 'checkout.session.completed',
        }));
        const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error('Jest setup must provide a temporary Stripe webhook secret');
        }

        const signature = Stripe.webhooks.generateTestHeaderString({
            payload: rawBody.toString(),
            secret: webhookSecret,
        });

        expect(provider.constructWebhookEvent(rawBody, signature)).toMatchObject({
            id: 'evt_unit_test',
            type: 'checkout.session.completed',
        });
        expect(() => provider.constructWebhookEvent(rawBody, 'invalid')).toThrow();
    });
});
