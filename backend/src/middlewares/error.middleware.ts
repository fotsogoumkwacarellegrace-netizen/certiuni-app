import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../errors/app.error';
import logger from '../common/utils/logger.util';
import { env } from '../config/env.config';

/**
 * Middleware global de gestion des erreurs Express.
 *
 * Centralise et formate toutes les réponses d'erreur de l'application :
 *   - AppError (erreurs opérationnelles métier) → utilise statusCode & status
 *   - ZodError (erreurs de validation) → 400 Bad Request avec détail des champs
 *   - PrismaClientKnownRequestError (conflits DB) → 409 ou 404 selon le code
 *   - JsonWebTokenError / TokenExpiredError → 401 Unauthorized
 *   - SyntaxError (JSON invalide) → 400 Bad Request
 *   - Erreurs non gérées → 500 Internal Server Error
 *
 * Toutes les erreurs sont journalisées via StructuredLogger (Winston) avec :
 *   - Le niveau approprié (error/warn)
 *   - Le correlationId de la requête
 *   - La stack trace en développement uniquement
 */
export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): void => {
    let statusCode = 500;
    let status = 'error';
    let message = 'Une erreur interne du serveur est survenue.';
    let errors: Array<{ field?: string; message: string }> | undefined;

    const correlationId = (req as any).correlationId;
    const userId = (req as any).user?.id;

    const baseLogMeta: Record<string, unknown> = {
        correlationId,
        userId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    };

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        status = err.status;
        message = err.message;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        status = 'fail';
        message = 'Données de requête invalides.';
        errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            status = 'fail';
            const target =
                (err.meta?.target as string[] | undefined)?.join(', ') || 'champ';
            message = `Une entrée existe déjà pour ce ${target}.`;
        } else if (err.code === 'P2025') {
            statusCode = 404;
            status = 'fail';
            message = 'Enregistrement ciblé introuvable en base de données.';
        } else if (err.code === 'P2003') {
            statusCode = 400;
            status = 'fail';
            message = 'Échec de contrainte de clé étrangère dans la base de données.';
        } else {
            statusCode = 400;
            status = 'fail';
            message = `Erreur de base de données (Code: ${err.code}).`;
        }
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        status = 'fail';
        message = 'Jeton JWT invalide.';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        status = 'fail';
        message = 'Jeton JWT expiré. Veuillez vous reconnecter.';
    } else if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
        statusCode = 400;
        status = 'fail';
        message = 'Le corps de la requête contient un JSON invalide.';
    }

    // Journalisation structurée de l'erreur
    const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    logger.log(message, 'ErrorHandler', {
        ...baseLogMeta,
        errorType: err.name,
        errorMessage: err.message,
        stack: env.NODE_ENV !== 'production' ? err.stack : undefined,
        statusCode,
    });

    res.status(statusCode).json({
        status,
        message,
        ...(errors ? { errors } : {}),
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

// import { Request, Response, NextFunction } from 'express';
// import { ZodError } from 'zod';
// import { Prisma } from '@prisma/client';
// import { AppError } from '../errors/app.error';

// /**
//  * Middleware d'erreur global pour Express.
//  * Formate et centralise toutes les réponses d'erreur de l'application.
//  */
// export const errorHandler = (
//     err: Error,
//     req: Request,
//     res: Response,
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     next: NextFunction
// ): void => {
//     let statusCode = 500;
//     let message = 'Une erreur interne est survenue sur le serveur.';
//     let errors: Array<{ field?: string; message: string }> | undefined = undefined;

//     // 1. Gestion des erreurs métier personnalisées (AppError)
//     if (err instanceof AppError) {
//         statusCode = err.statusCode;
//         message = err.message;
//     }

//     // 2. Gestion des erreurs de validation Zod
//     else if (err instanceof ZodError) {
//         statusCode = 400;
//         message = 'Données de requête invalides.';
//         errors = err.errors.map((e) => ({
//             field: e.path.join('.'),
//             message: e.message,
//         }));
//     }

//     // 3. Gestion des erreurs connues de Prisma (ORM)
//     else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//         switch (err.code) {
//             case 'P2002': {
//                 statusCode = 409;
//                 const target = (err.meta?.target as string[])?.join(', ') || 'champ';
//                 message = `Une entrée avec cette valeur existe déjà pour : ${target}.`;
//                 break;
//             }
//             case 'P2025':
//                 statusCode = 404;
//                 message = 'La ressource demandée n\'a pas été trouvée.';
//                 break;
//             case 'P2003':
//                 statusCode = 400;
//                 message = 'Échec de contrainte de clé étrangère dans la base de données.';
//                 break;
//             default:
//                 statusCode = 400;
//                 message = `Erreur de base de données (Code: ${err.code}).`;
//                 break;
//         }
//     }

//     // 4. Erreur d'initialisation ou d'abandon de connexion Prisma
//     else if (err instanceof Prisma.PrismaClientInitializationError) {
//         statusCode = 503;
//         message = 'Impossible de se connecter à la base de données.';
//     }

//     // Log de l'erreur en environnement de développement ou de test
//     if (process.env.NODE_ENV !== 'production') {
//         console.error('💥 [ERROR LOG]:', err);
//     }

//     // Réponse JSON structurée
//     res.status(statusCode).json({
//         status: statusCode >= 500 ? 'error' : 'fail',
//         message,
//         ...(errors && { errors }),
//         ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
//     });
// };