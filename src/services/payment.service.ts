import { prisma } from '../config/database';
import logger from '../common/utils/logger.util';
import crypto from 'crypto';

export enum PaymentGateway {
  MOMO = 'MOMO',
  ORANGE = 'ORANGE',
  CARD = 'CARD',
}

export interface ProcessPaymentPayload {
  certificateId: string;
  studentId: string;
  amount: number;
  gateway: PaymentGateway;
  phoneNumber?: string;
  cardToken?: string;
}

export class PaymentService {
  private readonly BASE_AMOUNT = 2000; // 2000 FCFA

  async processPayment(payload: ProcessPaymentPayload): Promise<any> {
    try {
      const transactionReference = this._generateTransactionReference();

      // Mock payment processing - in production, call actual payment gateway
      const isSuccessful = await this._callPaymentGateway(
        payload.gateway,
        payload.phoneNumber || payload.cardToken || '',
        payload.amount
      );

      const payment = await (prisma.payment as any).create({
        data: {
          certificateId: payload.certificateId,
          studentId: payload.studentId,
          amount: payload.amount,
          gateway: payload.gateway, // au lieu de paymentGateway: payload.gateway
          transactionReference,
          isSuccessful,
          paidAt: isSuccessful ? new Date() : null,
        },
      });

      if (isSuccessful) {
        // Update certificate payment status
        await prisma.certificate.update({
          where: { id: payload.certificateId },
          data: { paymentState: 'PAID' },
        });

        logger.info(`Payment processed successfully for certificate ${payload.certificateId}`, {
          transactionReference,
        });
      }

      return { payment, transactionReference, isSuccessful };
    } catch (error) {
      logger.error('Failed to process payment', { error });
      throw error;
    }
  }

  async getPaymentByReference(reference: string): Promise<any> {
    try {
      return await prisma.payment.findUnique({
        where: { transactionReference: reference },
      });
    } catch (error) {
      logger.error(`Failed to fetch payment with reference ${reference}`, { error });
      throw error;
    }
  }

  async getStudentPaymentHistory(studentId: string, limit = 50, offset = 0): Promise<any[]> {
    try {
      return await prisma.payment.findMany({
        where: { studentId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });
    } catch (error) {
      logger.error(`Failed to fetch payment history for student ${studentId}`, { error });
      throw error;
    }
  }

  private _generateTransactionReference(): string {
    return `TRX-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  private async _callPaymentGateway(
    gateway: PaymentGateway,
    credential: string,
    amount: number
  ): Promise<boolean> {
    // Mock implementation - replace with actual payment gateway API calls
    // In production:
    // - Call MTN MoMo API for MOMO gateway
    // - Call Orange Money API for ORANGE gateway
    // - Call Stripe/PayPal for CARD gateway

    logger.info(`[MOCK] Processing ${amount} FCFA payment via ${gateway} with credential ${credential}`);

    // Simulate 95% success rate
    return Math.random() > 0.05;
  }

  getRequiredAmount(): number {
    return this.BASE_AMOUNT;
  }
}

export const paymentService = new PaymentService();
