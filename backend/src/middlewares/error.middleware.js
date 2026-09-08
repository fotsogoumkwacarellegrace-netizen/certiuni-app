"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const app_error_1 = require("../errors/app.error");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let status = 'error';
    let message = 'Une erreur interne du serveur est survenue.';
    let errors;
    if (err instanceof app_error_1.AppError) {
        statusCode = err.statusCode;
        status = err.status;
        message = err.message;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        status = 'fail';
        message = 'Données de requête invalides.';
        errors = err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
        }));
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            status = 'fail';
            const target = err.meta?.target?.join(', ') || 'champ';
            message = `Une entrée existe déjà pour ce ${target}.`;
        }
        else if (err.code === 'P2025') {
            statusCode = 404;
            status = 'fail';
            message = 'Enregistrement ciblé introuvable en base de données.';
        }
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        status = 'fail';
        message = 'Jeton JWT invalide.';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        status = 'fail';
        message = 'Jeton JWT expiré. Veuillez vous reconnecter.';
    }
    else if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
        statusCode = 400;
        status = 'fail';
        message = 'Le corps de la requête contient un JSON invalide.';
    }
    if (statusCode === 500) {
        console.error('💥 ERREUR NON TRAITÉE :', err);
    }
    res.status(statusCode).json({
        status,
        message,
        ...(errors ? { errors } : {}),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=error.middleware.js.map