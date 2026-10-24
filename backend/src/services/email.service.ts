import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { MailMessage, MailProvider } from '../modules/integrations/providers/mail/mail-provider.interface';
import { env } from '../config/env.config';
import logger from '../common/utils/logger.util';

@Injectable()
export class EmailService implements MailProvider {
    private readonly transporter?: nodemailer.Transporter;

    constructor() {
        if (
            env.SMTP_HOST &&
            env.SMTP_PORT &&
            env.SMTP_USER &&
            env.SMTP_PASS &&
            env.MAIL_FROM
        ) {
            this.transporter = nodemailer.createTransport({
                host: env.SMTP_HOST,
                port: env.SMTP_PORT,
                secure: env.SMTP_PORT === 465,
                connectionTimeout: 10000,
                greetingTimeout: 10000,
                socketTimeout: 20000,
                auth: {
                    user: env.SMTP_USER,
                    pass: env.SMTP_PASS,
                },
            });
        }
    }

    get configured(): boolean {
        return Boolean(this.transporter && env.MAIL_FROM);
    }

    async verifyConnection(): Promise<void> {
        await this.requireTransporter().verify();
    }

    async sendEmail(payload: MailMessage): Promise<boolean> {
        const transporter = this.requireTransporter();
        const from = env.MAIL_FROM;
        if (!from) {
            throw new ServiceUnavailableException({
                error: 'not_configured',
                feature: 'smtp',
            });
        }

        const result = await transporter.sendMail({
            from,
            to: payload.to,
            subject: payload.subject,
            html: payload.html,
            attachments: payload.attachments,
        });

        logger.info(`Email delivered to ${payload.to}`, { messageId: result.messageId });
        return true;
    }

    async sendMagicLinkEmail(email: string, token: string): Promise<boolean> {
        const magicLink = `${env.FRONTEND_URL}/login?token=${encodeURIComponent(token)}`;
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Connexion à CertiUni</h2>
        <p>Bonjour,</p>
        <p>Cliquez sur le lien ci-dessous pour accéder à votre compte CertiUni:</p>
        <p><a href="${magicLink}" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Se connecter</a></p>
        <p>Ce lien expire dans 15 minutes.</p>
        <p>Si vous n'avez pas demandé cette connexion, ignorez cet e-mail.</p>
      </div>
    `;

        return this.sendEmail({
            to: email,
            subject: 'Connexion à CertiUni',
            html,
        });
    }

    async sendCertificateIssuedEmail(email: string, studentName: string, certificateId: string): Promise<boolean> {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Votre diplôme a été émis</h2>
        <p>Bonjour ${studentName},</p>
        <p>Votre diplôme a été émis avec succès sur la plateforme CertiUni.</p>
        <p><a href="${env.FRONTEND_URL}/verify" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Vérifier mon diplôme</a></p>
        <p>ID du certificat: ${certificateId}</p>
      </div>
    `;

        return this.sendEmail({
            to: email,
            subject: 'Diplôme émis - CertiUni',
            html,
        });
    }

    async sendPaymentReceiptEmail(email: string, certificateId: string, amount: number, transactionRef: string): Promise<boolean> {
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reçu de paiement</h2>
        <p>Merci pour votre paiement!</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 12px; border: 1px solid #e5e7eb;">ID Certificat</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${certificateId}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">Montant</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${amount} FCFA</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 12px; border: 1px solid #e5e7eb;">Référence</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${transactionRef}</td>
          </tr>
        </table>
        <p>Votre copie conforme certifiée est maintenant disponible.</p>
      </div>
    `;

        return this.sendEmail({
            to: email,
            subject: 'Reçu de paiement - CertiUni',
            html,
        });
    }

    private requireTransporter(): nodemailer.Transporter {
        if (!this.configured || !this.transporter) {
            throw new ServiceUnavailableException({
                error: 'not_configured',
                feature: 'smtp',
            });
        }
        return this.transporter;
    }
}

export const emailService = new EmailService();
