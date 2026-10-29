import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { catchAsync } from '../common/utils/catchAsync';
import { sendSuccessResponse, sendErrorResponse } from '../common/utils/responseFormatter';
import { UserRole } from '@prisma/client';

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
            code: true,
            logoUrl: true,
            website: true,
            isVerified: true,
            createdAt: true,
        },
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
        const { name, logoUrl, website } = req.body;

    if (!universityId) {
        return sendErrorResponse(res, 401, 'Université non identifiée');
    }

    const updated = await prisma.university.update({
        where: { id: universityId },
        data: {
            ...(name && { name }),
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
/** GET /api/v1/universities - Lister toutes les universités (SUPER_ADMIN uniquement) */
export const findAllUniversities = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;

    // Seuls les SUPER_ADMIN peuvent lister toutes les universités
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
        return sendErrorResponse(res, 403, 'Seul un SUPER_ADMIN peut lister toutes les universités.');
    }

    const universities = await prisma.university.findMany({
        select: {
            id: true,
            name: true,
            code: true,
            isVerified: true,
            createdAt: true,
        },
        orderBy: { name: 'asc' },
    });

    return sendSuccessResponse(res, 200, { universities });
});

/**\n * Create a new university (SUPER_ADMIN only)\n */
export const createUniversity = catchAsync(async (req: Request, res: Response) => {
    const universityId = req.user?.universityId;

    // Seuls les SUPER_ADMIN peuvent créer des universités
    if (!universityId || req.user?.role !== UserRole.SUPER_ADMIN) {
        return sendErrorResponse(res, 403, 'Seul un SUPER_ADMIN peut créer une université.');
    }

    const { name, code, contactEmail, isActive } = req.body;

    if (!name || !code) {
        return sendErrorResponse(res, 400, 'Le nom et le code de l\'université sont obligatoires.');
    }

    // Vérifier si le code existe déjà (contrainte unique au niveau de l\'application)
    const existing = await prisma.university.findUnique({
        where: { code },
    });

    if (existing) {
        return sendErrorResponse(res, 409, 'Un établissement avec ce code existe déjà.');
    }

    const university = await prisma.university.create({
        data: {
            name,
            code,
            logoUrl: req.body.logoUrl,
            website: req.body.website,
            isVerified: isActive !== undefined ? isActive : true,
        },
    });

    return sendSuccessResponse(res, 201, university, 'Université créée avec succès.');
});
