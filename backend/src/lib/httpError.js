"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.HttpError = void 0;
class HttpError extends Error {
    status;
    code;
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'HttpError';
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}
exports.HttpError = HttpError;
exports.Errors = {
    notFound(message = 'Ressource introuvable.') {
        return new HttpError(404, 'NOT_FOUND', message);
    },
    forbidden(message = 'Accès refusé : privilèges insuffisants.') {
        return new HttpError(403, 'FORBIDDEN', message);
    },
    badRequest(message = 'Requête invalide.', code = 'BAD_REQUEST') {
        return new HttpError(400, code, message);
    },
    conflict(message = 'Conflit métier.', code = 'CONFLICT') {
        return new HttpError(409, code, message);
    },
    unauthorized(message = 'Accès non autorisé.') {
        return new HttpError(401, 'UNAUTHORIZED', message);
    },
    internal(message = 'Erreur interne du serveur.') {
        return new HttpError(500, 'INTERNAL_SERVER_ERROR', message);
    },
};
//# sourceMappingURL=httpError.js.map