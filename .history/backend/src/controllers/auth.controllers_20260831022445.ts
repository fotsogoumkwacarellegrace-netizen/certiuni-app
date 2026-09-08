import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { catchAsync } from '../utils/catchAsync';
import { AuthService } from '../services/auth.service';
import { AuditService, AuditAction } from '../services/audit.service';
import { UnauthorizedError, BadRequestError, NotFoundError } from '../errors/app.error';

// Options de cookie sécurisées pour le Refresh Token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
};

/**
 * Connexion utilisateur avec support MFA et Refresh Token
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password, mfaCode } = req.body;

  // 1. Recherche de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email },
    include: { university: { select: { id: true, name: true } } },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new UnauthorizedError('Identifiants de connexion invalides.');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Votre compte utilisateur a été désactivé.');
  }

  // 2. Vérification MFA si activé sur le compte
  if (user.isMfaEnabled) {
    if (!mfaCode) {
      res.status(200).json({
        status: 'mfa_required',
        message: 'Un code MFA à 6 chiffres est requis pour finaliser la connexion.',
      });
      return;
    }

    if (!user.mfaSecret || !AuthService.verifyMfaCode(mfaCode, user.mfaSecret)) {
      throw new UnauthorizedError('Code MFA à 6 chiffres invalide ou expiré.');
    }
  }

  // 3. Génération des Jetons (Access & Refresh Tokens)
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    universityId: user.universityId,
  };

  const { accessToken, refreshToken } = AuthService.generateTokens(payload);
  await AuthService.storeRefreshToken(user.id, refreshToken);

  // 4. Inscription dans le journal d'audit
  await AuditService.logAction({
    action: AuditAction.USER_LOGIN,
    userId: user.id,
    universityId: user.universityId || undefined,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  // 5. Envoi du Refresh Token en Cookie HTTP-Only et de l'Access Token en JSON
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    status: 'success',
    message: 'Connexion réussie.',
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      university: user.university,
    },
  });
});

/**
 * Rafraîchissement de l'Access Token à partir du Refresh Token
 */
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const tokenFromCookie = req.cookies?.refreshToken;
  const tokenFromBody = req.body?.refreshToken;
  const token = tokenFromCookie || tokenFromBody;

  if (!token) {
    throw new UnauthorizedError('Jeton de rafraîchissement absent.');
  }

  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string };
  } catch {
    throw new UnauthorizedError('Jeton de rafraîchissement invalide ou expiré.');
  }

  // Vérification de la présence du token en mémoire Redis (session valide)
  const storedToken = await AuthService.revokeRefreshToken(decoded.id); // On récupère et vérifie
  if (!storedToken) {
    throw new UnauthorizedError('Session expirée ou révoquée.');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user || !user.isActive) {
    throw new UnauthorizedError('Compte introuvable ou inactif.');
  }

  // Émission d'un nouveau couple de jetons (Token Rotation)
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    universityId: user.universityId,
  };

  const newTokens = AuthService.generateTokens(payload);
  await AuthService.storeRefreshToken(user.id, newTokens.refreshToken);

  res.cookie('refreshToken', newTokens.refreshToken, REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    status: 'success',
    accessToken: newTokens.accessToken,
  });
});

/**
 * Déconnexion de l'utilisateur (Invalidation des jetons)
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  if (req.user?.id) {
    await AuthService.revokeRefreshToken(req.user.id);
  }

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);

  res.status(200).json({
    status: 'success',
    message: 'Déconnexion effectuée avec succès.',
  });
});

/**
 * Génération du Secret & QR Code pour l'activation du MFA
 */
export const setupMfa = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('Utilisateur non trouvé.');

  const { secret, otpAuthUrl } = await AuthService.generateMfaSecret(user.email);

  // Sauvegarde temporaire du secret non encore validé
  await prisma.user.update({
    where: { id: userId },
    data: { mfaSecret: secret, isMfaEnabled: false },
  });

  res.status(200).json({
    status: 'success',
    secret,
    otpAuthUrl,
  });
});

/**
 * Confirmation et activation définitive du MFA
 */
export const enableMfa = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { token } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.mfaSecret) {
    throw new BadRequestError('Veuillez d\'abord initialiser la configuration MFA.');
  }

  const isValid = AuthService.verifyMfaCode(token, user.mfaSecret);
  if (!isValid) {
    throw new BadRequestError('Le code de vérification est invalide.');
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isMfaEnabled: true },
  });

  res.status(200).json({
    status: 'success',
    message: 'L\'authentification à deux facteurs (MFA) est désormais activée.',
  });
});


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