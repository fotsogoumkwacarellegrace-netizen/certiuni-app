"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class BadRequestError extends AppError {
    constructor(message = 'Requête invalide.') {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = 'Accès non autorisé. Authentification requise.') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Accès interdit. Droits insuffisants.') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(message = 'Ressource introuvable.') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = 'Conflit avec une ressource existante.') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends AppError {
    constructor(message = 'Une erreur interne du serveur est survenue.') {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=app.error.js.map