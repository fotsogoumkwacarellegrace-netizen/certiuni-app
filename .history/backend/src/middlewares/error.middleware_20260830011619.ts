import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/app.error';

/**
 * Middleware d'erreur global pour Express.
 * Formate et centralise toutes les réponses d'erreur de l'application.
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Une erreur interne est survenue sur le serveur.';
    let errors: Array<{ field?: string; message: string }> | undefined = undefined;

    // 1. Gestion des erreurs métier personnalisées (AppError)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // 2. Gestion des erreurs de validation Zod
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Données de requête invalides.';
        errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
    }

    // 3. Gestion des erreurs connues de Prisma (ORM)
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002': {
                statusCode = 409;
                const target = (err.meta?.target as string[])?.join(', ') || 'champ';
                message = `Une entrée avec cette valeur existe déjà pour : ${target}.`;
                break;
            }
            case 'P2025':
                statusCode = 404;
                message = 'La ressource demandée n\'a pas été trouvée.';
                break;
            case 'P2003':
                statusCode = 400;
                message = 'Échec de contrainte de clé étrangère dans la base de données.';
                break;
            default:
                statusCode = 400;
                message = `Erreur de base de données (Code: ${err.code}).`;
                break;
        }
    }

    // 4. Erreur d'initialisation ou d'abandon de connexion Prisma
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 503;
        message = 'Impossible de se connecter à la base de données.';
    }

    // Log de l'erreur en environnement de développement ou de test
    if (process.env.NODE_ENV !== 'production') {
        console.error('💥 [ERROR LOG]:', err);
    }

    // Réponse JSON structurée
    res.status(statusCode).json({
        status: statusCode >= 500 ? 'error' : 'fail',
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};