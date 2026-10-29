import nodemailer from 'nodemailer';
import { env } from '../config/env.config';
import logger from '../common/utils/logger.util';

export interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    attachments?: any[];
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        host: env.SMTP_HOST || 'smtp.mailtrap.io',
        port: Number(env.SMTP_PORT) || 2525,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
    });

    async sendEmail(payload: EmailPayload): Promise<boolean> {
        try {
            const result = await this.transporter.sendMail({
                from: env.MAIL_FROM || 'noreply@certiuni.app',
                to: payload.to,
                subject: payload.subject,
                html: payload.html,
                attachments: payload.attachments,
            });

            logger.info(`Email sent successfully to ${payload.to}`, { messageId: result.messageId });
            return true;
        } catch (error) {
            logger.error(`Failed to send email to ${payload.to}`, { error });
            return false;
        }
    }

    async sendMagicLinkEmail(email: string, token: string): Promise<boolean> {
        const magicLink = `${env.FRONTEND_URL || 'https://certiuni.app'}/login?token=${token}`;
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
        <p><a href="${env.FRONTEND_URL || 'https://certiuni.app'}/verify" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Vérifier mon diplôme</a></p>
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
}

export const emailService = new EmailService();
