import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import {
    login,
    refreshToken,
    logout,
    setupMfa,
    enableMfa,
} from '../controllers/auth.controller'; // 👈 Un seul "../" si pas de sous-dossier v1

import { validateRequest } from '../../middlewares/validate.middleware';
import { authenticateJwt } from '../../middlewares/auth.middleware';
import { createRateLimiter } from '../../middlewares/rateLimit.middleware';
import {
    LoginSchema,
    RefreshTokenSchema,
    EnableMfaSchema,
} from '../../dtos/auth.dto';
const router = Router();

/**
 * POST /api/v1/auth/login
 * Connexion utilisateur & génération du jeton JWT
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // 1. Validation de la présence des champs requis
        if (!email || !password) {
            res.status(400).json({
                status: 'fail',
                message: 'Veuillez fournir un email et un mot de passe.',
            });
            return;
        }

        // 2. Recherche de l'utilisateur par son email avec les informations de l'université
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            include: {
                university: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        });

        if (!user) {
            res.status(401).json({
                status: 'fail',
                message: 'Identifiants invalides (email ou mot de passe incorrect).',
            });
            return;
        }

        // 3. Vérification du mot de passe avec bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            res.status(401).json({
                status: 'fail',
                message: 'Identifiants invalides (email ou mot de passe incorrect).',
            });
            return;
        }

        // 4. Construction du Payload JWT
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            universityId: user.universityId,
        };

        const secretKey = process.env.JWT_SECRET || 'super_secret_certiuni_key_2026';

        // 5. Signature du jeton (Valide 15 minutes)
        const accessToken = jwt.sign(payload, secretKey, {
            expiresIn: '15m',
        });

        // 6. Envoi de la réponse JSON
        res.status(200).json({
            status: 'success',
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                universityId: user.universityId,
                universityName: user.university?.name || null,
            },
        });
    } catch (error) {
        console.error('Erreur lors du login :', error);
        res.status(500).json({
            status: 'error',
            message: 'Erreur interne du serveur lors de la connexion.',
        });
    }
});

export default router;