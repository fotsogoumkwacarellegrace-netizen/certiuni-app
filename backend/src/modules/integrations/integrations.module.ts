// src/modules/integrations/integrations.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PAYMENT_PROVIDER } from './providers/payment-gateways/payment-provider.interface';
import { StripePaymentProvider } from './providers/payment-gateways/stripe-payment.provider';
import { MAIL_PROVIDER } from './providers/mail/mail-provider.interface';
import { EmailService } from '../../services/email.service';
import { IntegrationsRegistryService } from './integrations-registry.service';
import { ReservedIntegrationsController } from './reserved-integrations.controller';

@Global()
@Module({
    imports: [ConfigModule],
    controllers: [ReservedIntegrationsController],
    providers: [
        StripePaymentProvider,
        EmailService,
        IntegrationsRegistryService,
        {
            provide: PAYMENT_PROVIDER,
            useExisting: StripePaymentProvider,
        },
        {
            provide: MAIL_PROVIDER,
            useExisting: EmailService,
        },
    ],
    exports: [
        PAYMENT_PROVIDER,
        StripePaymentProvider,
        MAIL_PROVIDER,
        EmailService,
        IntegrationsRegistryService,
    ],
})
export class IntegrationsModule { }