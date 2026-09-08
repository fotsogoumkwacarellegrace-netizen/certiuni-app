export declare class SmsService {
    private readonly logger;
    sendSms(to: string, message: string): Promise<boolean>;
}
