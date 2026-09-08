import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseFormatter';

/**
 * Get university dashboard with KPIs and statistics
 */
export const getDashboard = catchAsync(async (req: Request, res: Response) => {
    const universityId = req.user?.universityId;

    if (!universityId) {
        return sendErrorResponse(res, 401, 'Université non identifiée');
    }

    const [certificateCount, verificationCount, revenue] = await Promise.all([
        prisma.certificate.count({ where: { universityId } }),
        (prisma as any).verificationLog.count({ where: { universityId } }),
        prisma.payment.aggregate({
            where: { universityId } as any,
            _sum: { amount: true },
        }),
    ]);

    return sendSuccessResponse(res, 200, {
        university: req.user,
        statistics: {
            totalCertificates: certificateCount,
            totalVerifications: verificationCount,
            totalRevenue: revenue._sum.amount || 0,
            lastUpdated: new Date().toISOString(),
        },
    });
});

/**
 * Get university by ID
 */
export const getUniversityById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const university = await prisma.university.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            code: true, // <-- Utiliser 'code' au lieu de 'acronym'
            acronym: true,
            logoUrl: true,
            website: true,
            isVerified: true,
            createdAt: true,
        } as any ,
    });

    if (!university) {
        return sendErrorResponse(res, 404, 'Université introuvable');
    }

    return sendSuccessResponse(res, 200, university);
});

/**
 * Update university profile
 */
export const updateUniversity = catchAsync(async (req: Request, res: Response) => {
    const universityId = req.user?.universityId;
    const { name, acronym, logoUrl, website } = req.body;

    if (!universityId) {
        return sendErrorResponse(res, 401, 'Université non identifiée');
    }

    const updated = await prisma.university.update({
        where: { id: universityId },
        data: {
            ...(name && { name }),
            ...(acronym && { acronym }),
            ...(logoUrl && { logoUrl }),
            ...(website && { website }),
        },
    });

    return sendSuccessResponse(res, 200, updated, 'Université mise à jour avec succès');
});

/**
 * Get audit logs for university
 */
export const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const universityId = req.user?.universityId;
    const { limit = 50, offset = 0 } = req.query;

    if (!universityId) {
        return sendErrorResponse(res, 401, 'Université non identifiée');
    }

    const logs = await prisma.auditLog.findMany({
        where: { universityId },
        orderBy: { createdAt: 'desc' },
        take: Math.min(parseInt(limit as string) || 50, 100),
        skip: parseInt(offset as string) || 0,
        include: {
            user: { select: { id: true, email: true } },
        },
    });

    return sendSuccessResponse(res, 200, logs);
});
