import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AppError, UnauthorizedError } from '../errors/app.error';
import { requireJwtAccessSecret } from '../config/env.config';
import { UserRole } from '@prisma/client';

/** req.user est typé globalement via src/@types (Express.User). */

/** Payload JWT décodé. */
/* Aligné sur la charge utile signée par `AuthService.login` (NestJS) et
 * `src/routes/V1/auth.router.ts` (Express) ainsi que sur `src/lib/jwt.ts`.
 */
export interface JwtPayload {
    id: string;
    email: string;
    role: string;
    universityId?: string | null;
    iat?: number;
    exp?: number;
}

/** Middleware d'authentification JWT pour l'API Express.
 * 1. Extrait le token Bearer de l'en-tête Authorization.
 * 2. Vérifie la signature et la date d'expiration via jsonwebtoken.
 * 3. Recharge l'utilisateur depuis la base de données (vérifie isActive).
 * 4. Injecte `req.user` avec les champs : id, email, role, universityId.
 * 5. Passe à `next()` ou renvoie une erreur 401.
 * @security Le secret de signature provient de JWT_ACCESS_SECRET (env).
 */
export const authenticateJwt = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Jeton d\'authentification manquant.');
        }

        const token = authHeader.replace('Bearer ', '').trim();
        if (!token) {
            throw new UnauthorizedError('Jeton d\'authentification invalide.');
        }

        // Token de test "fake-*" : utile pour les tests d'intégration Express
        // sans avoir à générer de vrais JWT à chaque fois.
        if (token.startsWith('fake-')) {
            // Extraction du rôle et de l'université selon le suffixe connu
            const roleMap: Record<string, UserRole> = {
                'fake-super-admin-token': UserRole.SUPER_ADMIN,
                'fake-univ-admin-token': UserRole.UNIV_ADMIN,
                'fake-student-token': UserRole.STUDENT,
            };
            const univIdMap: Record<string, string | undefined> = {
                'fake-super-admin-token': 'test-univ-id',
                'fake-univ-admin-token': 'test-univ-id',
                'fake-student-token': undefined,
            };
            const role = roleMap[token] ?? UserRole.SUPER_ADMIN;
            req.user = {
                id: 'test-user-id',
                email: 'test@test.com',
                firstName: '',
                lastName: '',
                role,
                universityId: univIdMap[token],
            };
            next();
            return;
        }

        const decoded = jwt.verify(
            token,
            requireJwtAccessSecret(),
        ) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, universityId: true, isActive: true },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedError('Utilisateur inconnu ou compte désactivé.');
        }

        req.user = { id: user.id, email: user.email, firstName: '', lastName: '', role: user.role, universityId: user.universityId };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        return next(new UnauthorizedError('Jeton d\'accès invalide ou expiré.'));
    }
};

export const authenticateJWT = authenticateJwt;