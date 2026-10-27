import { Inject, Injectable } from '@nestjs/common';
import { env } from '../../config/env.config';
import { PAYMENT_PROVIDER, PaymentProvider } from './providers/payment-gateways/payment-provider.interface';
import { MAIL_PROVIDER, MailProvider } from './providers/mail/mail-provider.interface';

export type IntegrationState = 'active' | 'disabled' | 'placeholder';

export interface IntegrationCapability {
    feature: string;
    state: IntegrationState;
    reason?: string;
    mode?: 'test' | 'live' | 'unconfigured';
}

@Injectable()
export class IntegrationsRegistryService {
    constructor(
        @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: PaymentProvider,
        @Inject(MAIL_PROVIDER) private readonly mailProvider: MailProvider,
    ) { }

    getCapabilities(): { integrations: IntegrationCapability[] } {
        const jwtConfigured = Boolean(env.JWT_ACCESS_SECRET && env.JWT_REFRESH_SECRET);
        const qrConfigured = Boolean(env.QR_SECRET_KEY && env.PUBLIC_VERIFY_URL);

        return {
            integrations: [
                this.capability('postgresql', Boolean(env.DATABASE_URL)),
                this.capability('transactions', Boolean(env.DATABASE_URL)),
                this.capability('jwt', jwtConfigured),
                this.capability('qr', qrConfigured),
                this.capability(
                    'storage',
                    Boolean(
                        env.AWS_REGION &&
                        env.AWS_ACCESS_KEY_ID &&
                        env.AWS_SECRET_ACCESS_KEY &&
                        env.AWS_S3_BUCKET,
                    ),
                ),
                {
                    feature: 'stripe',
                    state: this.paymentProvider.configured ? 'active' : 'disabled',
                    ...(!this.paymentProvider.configured && { reason: 'missing_configuration' }),
                    mode: this.paymentProvider.mode,
                },
                this.capability('smtp', this.mailProvider.configured),
                this.capability('google-oauth', false, 'placeholder'),
                this.capability('webauthn', false, 'placeholder'),
                this.capability('apple-sign-in', false, 'placeholder'),
                this.capability('specimen-mode', false, 'placeholder'),
            ],
        };
    }

    private capability(
        feature: string,
        configured: boolean,
        state?: IntegrationState,
    ): IntegrationCapability {
        if (state === 'placeholder') {
            return { feature, state, reason: 'reserved' };
        }
        return configured
            ? { feature, state: 'active' }
            : { feature, state: 'disabled', reason: 'missing_configuration' };
    }
}
