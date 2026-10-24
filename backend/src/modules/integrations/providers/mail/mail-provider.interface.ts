import type { SendMailOptions } from 'nodemailer';

export const MAIL_PROVIDER = Symbol('MAIL_PROVIDER');

export interface MailMessage {
    to: string;
    subject: string;
    html: string;
    attachments?: SendMailOptions['attachments'];
}

export interface MailProvider {
    readonly configured: boolean;
    sendEmail(message: MailMessage): Promise<boolean>;
    verifyConnection(): Promise<void>;
}
