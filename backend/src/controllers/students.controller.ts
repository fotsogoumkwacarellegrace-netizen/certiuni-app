import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { catchAsync } from '../common/utils/catchAsync';
import { sendSuccessResponse, sendErrorResponse } from '../common/utils/responseFormatter';
import { UserRole } from '@prisma/client';

/** GET /api/v1/students - Lister tous les étudiants */
export const findAll = catchAsync(async (req: Request, res: Response) => {
    const universityId = req.user?.universityId;

    const where: any =
        req.user?.role === UserRole.SUPER_ADMIN
            ? {}
            : { universityId };

    const students = await prisma.student.findMany({
        where,
        select: {
            id: true,
            matricule: true,
            firstName: true,
            lastName: true,
            email: true,
            university: { select: { name: true, code: true } },
            levelId: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    return sendSuccessResponse(res, 200, { students });
});

/** GET /api/v1/students/:id - Obtenir un étudiant par ID */
export const findOne = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
        where: { id },
        select: {
            id: true,
            matricule: true,
            firstName: true,
            lastName: true,
            email: true,
            universityId: true,
            levelId: true,
        },
    });

    if (!student) {
        return sendErrorResponse(res, 404, 'Profil étudiant introuvable.');
    }

    // Isolation multi-locataire : UNIV_ADMIN ne voit que ses étudiants
    if (
        req.user?.role !== UserRole.SUPER_ADMIN &&
        student.universityId !== req.user?.universityId
    ) {
        return sendErrorResponse(res, 403, 'Accès non autorisé à cet étudiant.');
    }

    return sendSuccessResponse(res, 200, { student });
});

/** POST /api/v1/students - Créer un nouvel étudiant (SUPER_ADMIN uniquement) */
export const create = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;

    // Seul SUPER_ADMIN peut créer des étudiants via cette route
    if (user?.role !== UserRole.SUPER_ADMIN) {
        return sendErrorResponse(res, 403, 'Seul le SUPER_ADMIN peut créer des étudiants.');
    }

    const { matricule, firstName, lastName, email, universityId, levelId } = req.body;

    if (!matricule || !firstName || !lastName || !email || !universityId) {
        return sendErrorResponse(res, 400, 'Les champs matricule, prénom, nom, email et universityId sont obligatoires.');
    }

    // Vérifier que l'université existe
    const university = await prisma.university.findUnique({
        where: { id: universityId },
    });

    if (!university) {
        return sendErrorResponse(res, 404, 'Université introuvable.');
    }

    // Vérifier que le matricule n'existe pas déjà (unique sur matricule + universityId)
    const existing = await prisma.student.findUnique({
        where: { matricule_universityId: { matricule, universityId } },
    });

    if (existing) {
        return sendErrorResponse(res, 409, 'Un étudiant avec ce matricule existe déjà dans cette université.');
    }

    const student = await prisma.student.create({
        data: {
            matricule,
            firstName,
            lastName,
            email,
            universityId,
            levelId: levelId || 'l1',
        },
    });

    return sendSuccessResponse(res, 201, { student }, 'Profil étudiant créé avec succès.');
});

/** PATCH /api/v1/students/:id - Mettre à jour un étudiant (SUPER_ADMIN ou UNIV_ADMIN) */
export const update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    const student = await prisma.student.findUnique({
        where: { id },
    });

    if (!student) {
        return sendErrorResponse(res, 404, 'Profil étudiant introuvable.');
    }

    // Isolation multi-locataire
    if (
        user?.role !== UserRole.SUPER_ADMIN &&
        student.universityId !== user?.universityId
    ) {
        return sendErrorResponse(res, 403, 'Accès non autorisé à cet étudiant.');
    }

    const { firstName, lastName, email, levelId } = req.body;

    const updated = await prisma.student.update({
        where: { id },
        data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(email && { email }),
            ...(levelId && { levelId: levelId }),
        },
    });

    return sendSuccessResponse(res, 200, { student: updated }, 'Profil étudiant mis à jour avec succès.');
});

/** DELETE /api/v1/students/:id - Supprimer un étudiant (SUPER_ADMIN uniquement) */
export const remove = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    // Seul SUPER_ADMIN peut supprimer via cette route
    if (user?.role !== UserRole.SUPER_ADMIN) {
        return sendErrorResponse(res, 403, 'Seul le SUPER_ADMIN peut supprimer des étudiants.');
    }

    const student = await prisma.student.findUnique({
        where: { id },
    });

    if (!student) {
        return sendErrorResponse(res, 404, 'Profil étudiant introuvable.');
    }

    await prisma.student.delete({
        where: { id },
    });

    return sendSuccessResponse(res, 200, { id }, 'Profil étudiant supprimé avec succès.');
});