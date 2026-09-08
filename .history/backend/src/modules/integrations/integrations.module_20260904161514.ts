// src/modules/integrations/integrations.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { R2S3StorageService } from './providers/storage/r2-s3.service';
import { AiService } from './providers/ai/ai.service';
import { PaymentProviderService } from './providers/payment-gateways/payment-provider.service';
import { SmsService } from './providers/sms/sms.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        R2S3StorageService,
        AiService,
        PaymentProviderService,
        SmsService,
    ],
    exports: [
        R2S3StorageService,
        AiService,
        PaymentProviderService,
        SmsService,
    ],
})
export class IntegrationsModule { }