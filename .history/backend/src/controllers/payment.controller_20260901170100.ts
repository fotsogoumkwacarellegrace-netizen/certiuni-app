import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseFormatter';
import { paymentService } from '../services/payment.service';
import { emailService } from '../services/email.service';
import { notificationService } from '../services/notification.service';

/**
 * Process payment for certificate
 */
export const processPayment = catchAsync(async (req: Request, res: Response) => {
    const { certificateId, gateway, phoneNumber, cardToken } = req.body;

    // Get certificate
    const certificate = await prisma.certificate.findUnique({
        where: { id: certificateId },
        include: { university: true },
    });

    if (!certificate) {
        return sendErrorResponse(res, 404, 'Diplôme introuvable');
    }

    const amount = paymentService.getRequiredAmount();

    const result = await paymentService.processPayment({
        certificateId,
        studentId: certificate.id, // In real app, get actual student ID
        amount, currency: payload.currency,
        // gateway: payload.gateway, <-- Supprimez cette ligne ou utilisez provider
        provider: payload.gateway,

        // gateway: gateway as any,
        phoneNumber,
        cardToken,
    });

    if (result.isSuccessful) {
        // Send payment receipt email
        await emailService.sendPaymentReceiptEmail(
            certificate.studentEmail,
            certificateId,
            amount,
            result.transactionReference
        );

        // Notify university
        await notificationService.notifyPaymentReceived(
            certificate.universityId,
            amount,
            `${certificate.studentFirstName} ${certificate.studentLastName}`
        );
    }

    return sendSuccessResponse(res, result.isSuccessful ? 200 : 400, result);
});

/**
 * Get payment history
 */
export const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
    const { limit = 50, offset = 0 } = req.query;

    const payments = await prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        take: Math.min(parseInt(limit as string) || 50, 100),
        skip: parseInt(offset as string) || 0,
    });

    return sendSuccessResponse(res, 200, payments);
});

/**
 * Get payment receipt
 */
export const getPaymentReceipt = catchAsync(async (req: Request, res: Response) => {
    const { transactionRef } = req.params;

    const payment = await paymentService.getPaymentByReference(transactionRef);

    if (!payment) {
        return sendErrorResponse(res, 404, 'Paiement introuvable');
    }

    return sendSuccessResponse(res, 200, payment);
});
