"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const app_error_1 = require("../errors/app.error");
const authenticateJwt = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new app_error_1.UnauthorizedError('Jeton d\'authentification manquant.');
        }
        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) {
            throw new app_error_1.UnauthorizedError('Jeton d\'authentification invalide.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET || 'certiuni-dev-secret');
        const user = await database_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, universityId: true, isActive: true },
        });
        if (!user || !user.isActive) {
            throw new app_error_1.UnauthorizedError('Utilisateur inconnu ou compte désactivé.');
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            universityId: user.universityId,
            firstName: '',
            lastName: '',
        };
        next();
    }
    catch (error) {
        if (error instanceof app_error_1.AppError) {
            return next(error);
        }
        return next(new app_error_1.UnauthorizedError('Jeton d\'accès invalide ou expiré.'));
    }
};
exports.authenticateJwt = authenticateJwt;
exports.authenticateJWT = exports.authenticateJwt;
//# sourceMappingURL=auth.middleware.js.map