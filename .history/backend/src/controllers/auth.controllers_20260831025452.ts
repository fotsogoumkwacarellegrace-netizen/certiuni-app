// 
// 


// import { Request, Response, NextFunction } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { authenticator } from 'otplib';
// import { PrismaClient } from '@prisma/client';
// import { AppError } from '../errors/app.error';
// import { LoginDTO, EnableMfaDTO, RefreshTokenDTO } from '../dtos/auth.dto';

// const prisma = new PrismaClient();

// const JWT_SECRET = process.env.JWT_SECRET || 'your_access_token_secret_key';
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret_key';

// /**
//  * Génère un Access Token JWT (courte durée)
//  */
// const generateAccessToken = (userId: string, role: string): string => {
//     return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '15m' });
// };

// /**
//  * Génère un Refresh Token JWT (longue durée)
//  */
// const generateRefreshToken = (userId: string): string => {
//     return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
// };

// /**
//  * POST /api/v1/auth/login
//  * Connexion utilisateur + vérification du mot de passe et MFA si activé
//  */
// export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const { email, password, mfaCode }: LoginDTO = req.body;

//         const user = await prisma.user.findUnique({
//             where: { email },
//             include: { university: true },
//         });

//         if (!user || !user.isActive) {
//             throw new AppError('Identifiants invalides ou compte désactivé.', 401);
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
//         if (!isPasswordValid) {
//             throw new AppError('Identifiants invalides ou compte désactivé.', 401);
//         }

//         // Exigence MFA : Si l'utilisateur a activé le MFA, le code TOTP est obligatoire
//         if (user.isMfaEnabled) {
//             if (!mfaCode) {
//                 res.status(200).json({
//                     status: 'mfa_required',
//                     message: 'Code MFA à double facteur requis.',
//                     mfaRequired: true,
//                 });
//                 return;
//             }

//             if (!user.mfaSecret) {
//                 throw new AppError('Configuration MFA corrompue sur ce compte.', 500);
//             }

//             const isValidTotp = authenticator.verify({
//                 token: mfaCode,
//                 secret: user.mfaSecret,
//             });

//             if (!isValidTotp) {
//                 throw new AppError('Code MFA invalide ou expiré.', 401);
//             }
//         }

//         const accessToken = generateAccessToken(user.id, user.role);
//         const refreshToken = generateRefreshToken(user.id);

//         // Mise à jour de la dernière connexion
//         await prisma.user.update({
//             where: { id: user.id },
//             data: { lastLoginAt: new Date() },
//         });

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
//         });

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 accessToken,
//                 user: {
//                     id: user.id,
//                     email: user.email,
//                     firstName: user.firstName,
//                     lastName: user.lastName,
//                     role: user.role,
//                     universityId: user.universityId,
//                 },
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// /**
//  * POST /api/v1/auth/refresh
//  * Renouvellement du jeton d'accès via le refresh token
//  */
// export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const token = req.cookies?.refreshToken || (req.body as RefreshTokenDTO).refreshToken;

//         if (!token) {
//             throw new AppError('Jeton de rafraîchissement absent.', 401);
//         }

//         let payload: { userId: string };
//         try {
//             payload = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
//         } catch {
//             throw new AppError('Jeton de rafraîchissement invalide ou expiré.', 401);
//         }

//         const user = await prisma.user.findUnique({
//             where: { id: payload.userId },
//         });

//         if (!user || !user.isActive) {
//             throw new AppError('Utilisateur inexistant ou suspendu.', 401);
//         }

//         const newAccessToken = generateAccessToken(user.id, user.role);

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 accessToken: newAccessToken,
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// /**
//  * POST /api/v1/auth/mfa/setup
//  * Génération du secret TOTP pour la configuration initiale MFA (Protégé par JWT)
//  */
// export const setupMfa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const userId = req.user?.id;
//         if (!userId) {
//             throw new AppError('Non authentifié.', 401);
//         }

//         const user = await prisma.user.findUnique({ where: { id: userId } });
//         if (!user) {
//             throw new AppError('Utilisateur introuvable.', 404);
//         }

//         const secret = authenticator.generateSecret();
//         const otpauthUrl = authenticator.keyuri(user.email, 'CertiUni', secret);

//         // Sauvegarde temporaire du secret non encore vérifié
//         await prisma.user.update({
//             where: { id: userId },
//             data: { mfaSecret: secret, isMfaEnabled: false },
//         });

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 secret,
//                 otpauthUrl,
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// /**
//  * POST /api/v1/auth/mfa/enable
//  * Validation initiale du code TOTP et activation définitive du MFA
//  */
// export const enableMfa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const userId = req.user?.id;
//         const { totpCode }: EnableMfaDTO = req.body;

//         if (!userId) {
//             throw new AppError('Non authentifié.', 401);
//         }

//         const user = await prisma.user.findUnique({ where: { id: userId } });
//         if (!user || !user.mfaSecret) {
//             throw new AppError('Veuillez d\'abord initialiser la configuration MFA.', 400);
//         }

//         const isValid = authenticator.verify({
//             token: totpCode,
//             secret: user.mfaSecret,
//         });

//         if (!isValid) {
//             throw new AppError('Code de vérification invalide.', 400);
//         }

//         await prisma.user.update({
//             where: { id: userId },
//             data: { isMfaEnabled: true },
//         });

//         res.status(200).json({
//             status: 'success',
//             message: 'Authentification à deux facteurs activée avec succès.',
//         });
//     } catch (error) {
//         next(error);
//     }
// };

/**
 * POST /api/v1/auth/logout
 * Déconnexion et suppression du cookie Refresh Token
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    res.status(200).json({
        status: 'success',
        message: 'Déconnexion effectuée.',
    });
};
// import { Request, Response } from 'express';

// export const login = async (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Login endpoint' });
// };

// export const refreshToken = async (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Refresh endpoint' });
// };

// export const logout = async (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Logout endpoint' });
// };

// export const setupMfa = async (req: Request, res: Response) => {
//     res.status(200).json({ message: 'Setup MFA endpoint' });
// };

export const enableMfa = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Enable MFA endpoint' });
};