import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    async sendSms(to: string, message: string): Promise<boolean> {
        this.logger.log(`[SMS Provider] Envoi à ${to} : "${message}"`);
        return true;
    }
}