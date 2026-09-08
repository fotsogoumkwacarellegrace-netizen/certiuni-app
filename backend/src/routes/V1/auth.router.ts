import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { authenticateJwt } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };

        if (!email || !password) {
            res.status(400).json({ status: 'fail', message: 'Email et mot de passe requis.' });
            return;
        }

        const user = await prisma.user.findUnique({
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

        const isPasswordValid = await bcrypt.compare(String(password), user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ status: 'fail', message: 'Identifiants invalides.' });
            return;
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                universityId: user.universityId,
            },
            process.env.JWT_ACCESS_SECRET || 'certiuni-dev-secret',
            { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as jwt.SignOptions['expiresIn'] }
        );

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
    } catch (error) {
        console.error('Erreur login', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de la connexion.' });
    }
});

router.post('/refresh', async (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: 'Refresh token route ready.' });
});

router.post('/logout', authenticateJwt, async (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', message: 'Déconnexion réussie.' });
});

export default router;
