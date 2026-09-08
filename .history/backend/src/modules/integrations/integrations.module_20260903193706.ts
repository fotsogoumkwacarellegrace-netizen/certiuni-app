// src/modules/integrations/integrations.module.ts
import { Module, Global } from '@nestjs/common';
import { R2S3StorageService } from './providers/storage/r2-s3.service';
import { AiService } from './providers/ai/ai.service';
import { PaymentProviderService } from './providers/payment-gateways/payment-provider.service';
import { SmsService } from './providers/sms/sms.service';

@Global() // Rendre les connecteurs accessibles dans toute l'application
@Module({
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