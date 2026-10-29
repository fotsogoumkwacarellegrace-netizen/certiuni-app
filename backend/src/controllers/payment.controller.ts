import { Request, Response } from 'express';
import { prisma } from '../config/database';

/**
 * Legacy Express payment route. Payment initiation is implemented by the
 * NestJS Stripe Checkout endpoint; this route must never simulate a charge.
 */
export const processPayment = async (req: Request, res: Response) => {
    return res.status(501).json({
        error: 'not_configured',
        feature: 'legacy-payment-route',
    });
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (req: Request, res: Response) => {
    const { limit = 50, offset = 0 } = req.query;

    const payments = await prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        take: Math.min(parseInt(limit as string) || 50, 100),
        skip: parseInt(offset as string) || 0,
    });

    return res.status(200).json({ status: 'success', data: payments });
};

/**
 * Get payment receipt
 */
export const getPaymentReceipt = async (req: Request, res: Response) => {
    const { transactionRef } = req.params;

    const payment = await prisma.payment.findUnique({
        where: { transactionReference: transactionRef },
    });

    if (!payment) {
        return res.status(404).json({ status: 'error', message: 'Paiement introuvable' });
    }

    return res.status(200).json({ status: 'success', data: payment });
};