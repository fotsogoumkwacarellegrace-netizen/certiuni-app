import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { catchAsync } from '../common/utils/catchAsync';
import { sendSuccessResponse, sendErrorResponse } from '../common/utils/responseFormatter';
import { UserRole } from '@prisma/client';

/** POST /api/v1/universités - Créer une université (SUPER_ADMIN uniquement) */
export const createUniversity = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;

    // Seul SUPER_ADMIN peut créer des universités
    if (user?.role !== UserRole.SUPER_ADMIN) {
        return sendErrorResponse(res, 403, 'Seul le SUPER_ADMIN peut créer des universités.');
    }

    const { name, code } = req.body;

    if (!name || !code) {
        return sendErrorResponse(res, 400, 'Les champs name et code sont obligatoires.');
    }

    // Vérifier que le code n'existe pas déjà
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
        },
    });

    return sendSuccessResponse(res, 201, { university }, 'Université créée avec succès.');
});

/** GET /api/v1/universities - Lister toutes les universités (SUPER_ADMIN uniquement) */
export const findAllUniversities = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;

    if (user?.role !== UserRole.SUPER_ADMIN) {
        return sendErrorResponse(res, 403, 'Accès non autorisé.');
    }

    const universities = await prisma.university.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return sendSuccessResponse(res, 200, { universities });
});

/** GET /api/v1/universities/:id - Obtenir une université par ID */
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
        return sendErrorResponse(res, 404, 'Université introuvable.');
    }

    return sendSuccessResponse(res, 200, university);
});

/** PATCH /api/v1/universities/:id - Mettre à jour une université (SUPER_ADMIN uniquement) */
export const updateUniversity = catchAsync(async (req: Request, res: Response) => {
    const universityId = req.user?.universityId;

    if (!universityId) {
        return sendErrorResponse(res, 401, 'Université non identifiée.');
    }

    const { name, logoUrl, website } = req.body;

    const updated = await prisma.university.update({
        where: { id: universityId },
        data: {
            ...(name && { name }),
            ...(logoUrl && { logoUrl }),
            ...(website && { website }),
        },
    });

    return sendSuccessResponse(res, 200, updated, 'Université mise à jour avec succès.');
});

/** GET /api/v1/universities/:id/audit-logs - Obtenir les logs d'audit (SUPER_ADMIN uniquement) */
export const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const universityId = req.user?.universityId;
    const { limit = 50, offset = 0 } = req.query;

    if (!universityId) {
        return sendErrorResponse(res, 401, 'Université non identifiée.');
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