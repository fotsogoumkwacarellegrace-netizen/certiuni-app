import { Request, Response } from 'express';
import { prisma } from '../config/database';
// import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseFormatter';
import { notificationService } from '../services/notification.service';
import logger from '../utils/logger';

/**
 * Report suspicious activity (anti-fraud)
 */
export const reportSuspiciousActivity = async (req: Request, res: Response) => {
    const { certificateId, reason, ipAddress, userAgent } = req.body;

    if (!certificateId || !reason) {
        return res.status(400).json({ status: 'error', message: 'Certificat et motif requis' });
    }

    try {
        const alert = await (prisma.auditLog as any).create({
            data: {
                action: 'FRAUD_ALERT',
                reason,
                metadata: {
                    certificateId,
                    reportedAt: new Date().toISOString(),
                    ipAddress,
                    userAgent,
                },
                ipAddress: ipAddress || 'UNKNOWN',
                userAgent: userAgent || 'UNKNOWN',
            },
        });

        // Notify all universities
        const universities = await prisma.university.findMany({
            select: { id: true },
        });

        for (const uni of universities) {
            await notificationService.notifySecurityAlert(uni.id, `Activité suspecte détectée: ${reason}`);
        }

        logger.warn('Fraud alert triggered', { certificateId, reason });

        return res.status(201).json({
            status: 'success',
            alertId: alert.id,
            status: 'reported',
        });
    } catch (error) {
        logger.error('Failed to report suspicious activity', { error });
        return res.status(500).json({ status: 'error', message: 'Erreur lors du rapport' });
    }
});

/**
 * Get suspicious activity logs
 */
export const getSuspiciousLogs = catchAsync(async (req: Request, res: Response) => {
    const { limit = 50, offset = 0 } = req.query;

    try {
        const logs = await prisma.auditLog.findMany({
            where: { action: 'FRAUD_ALERT' as any },
            orderBy: { createdAt: 'desc' },
            take: Math.min(parseInt(limit as string) || 50, 100),
            skip: parseInt(offset as string) || 0,
        });

        return sendSuccessResponse(res, 200, logs);
    } catch (error) {
        logger.error('Failed to fetch suspicious logs', { error });
        return sendErrorResponse(res, 500, 'Erreur lors de la récupération des logs');
    }
});

/**
 * Block IP address from verification attempts
 */
export const blockIpAddress = catchAsync(async (req: Request, res: Response) => {
    const { ipAddress, reason } = req.body;

    if (!ipAddress) {
        return sendErrorResponse(res, 400, 'Adresse IP requise');
    }

    try {
        // Store blocked IP in cache or database
        await (prisma.auditLog as any).create({
            data: {
                action: 'IP_BLOCKED',
                reason: reason || 'Manual IP block',
                ipAddress,
                metadata: { blockedAt: new Date().toISOString() },
            },
        });

        logger.warn(`IP address blocked: ${ipAddress}`, { reason });

        return sendSuccessResponse(res, 201, {
            ipAddress,
            status: 'blocked',
        });
    } catch (error) {
        logger.error('Failed to block IP', { error });
        return sendErrorResponse(res, 500, 'Erreur lors du blocage de l\'IP');
    }
});