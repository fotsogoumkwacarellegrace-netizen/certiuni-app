"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const app_error_1 = require("../errors/app.error");
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new app_error_1.ForbiddenError('Non authentifié. Veuillez vous connecter pour accéder à cette ressource.'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new app_error_1.ForbiddenError(`Votre rôle (${req.user.role}) ne vous permet pas d'effectuer cette action.`));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=role.middleware.js.map