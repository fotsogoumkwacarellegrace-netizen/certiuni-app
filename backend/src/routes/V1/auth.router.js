"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../config/database");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ status: 'fail', message: 'Email et mot de passe requis.' });
            return;
        }
        const user = await database_1.prisma.user.findUnique({
            where: { email: String(email).toLowerCase().trim() },
            select: {
                id: true,
                email: true,
                passwordHash: true,
                role: true,
                universityId: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            res.status(401).json({ status: 'fail', message: 'Identifiants invalides.' });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(String(password), user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ status: 'fail', message: 'Identifiants invalides.' });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            universityId: user.universityId,
        }, process.env.JWT_ACCESS_SECRET || 'certiuni-dev-secret', { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') });
        res.status(200).json({
            status: 'success',
            data: {
                accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    universityId: user.universityId,
                },
            },
        });
    }
    catch (error) {
        console.error('Erreur login', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de la connexion.' });
    }
});
router.post('/refresh', async (req, res) => {
    res.status(200).json({ status: 'success', message: 'Refresh token route ready.' });
});
router.post('/logout', auth_middleware_1.authenticateJwt, async (req, res) => {
    res.status(200).json({ status: 'success', message: 'Déconnexion réussie.' });
});
exports.default = router;
//# sourceMappingURL=auth.router.js.map