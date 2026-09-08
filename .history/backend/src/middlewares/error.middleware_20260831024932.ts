import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/app.error';
import { ZodError } from 'zod';
export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void => {
    let statusCode = 500;
    let status = 'error';
    let message = 'Une erreur interne du serveur est survenue.';

    // 1. Erreur personnalisée instanciée via AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        status = err.status;
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
    // 2. Erreurs Prisma Known Request (ex: violation d'unicité P2002)
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            status = 'fail';
            const target = (err.meta?.target as string[])?.join(', ') || 'champ';
            message = `Une entrée existe déjà pour ce ${target}.`;
        } else if (err.code === 'P2025') {
            statusCode = 404;
            status = 'fail';
            message = 'Enregistrement ciblé introuvable en base de données.';
        }
    }
    // 3. Erreurs de jeton JWT
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        status = 'fail';
        message = 'Jeton JWT invalide.';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        status = 'fail';
        message = 'Jeton JWT expiré. Veuillez vous re-connecter.';
    }
    // 4. Erreur de syntaxe JSON dans le body
    else if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
        statusCode = 400;
        status = 'fail';
        message = 'Le corps de la requête contient un JSON invalide.';
    }

    // Journalisation des erreurs non gérées/critiques
    if (statusCode === 500) {
        console.error('💥 ERREUR NON TRAITÉE :', err);
    }

    // Envoi de la réponse formatée
    res.status(statusCode).json({
        status,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            error: err,
            stack: err.stack,
        }),
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