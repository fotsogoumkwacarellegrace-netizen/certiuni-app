import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';
import { AppError } from '../errors/app.error';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_access_token_secret_key';

interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware d'authentification : Vérifie la présence et la validité du JWT dans l'entête Authorization.
 */
export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Accès non autorisé. Jeton d\'authentification manquant.', 401);
    }

    const token = authHeader.split(' ')[1];

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError('Jeton d\'accès invalide ou expiré.', 401);
    }

    // Récupération de l'utilisateur en base pour s'assurer que le compte est toujours actif
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, universityId: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new AppError('Utilisateur inexistant ou compte désactivé.', 401);
    }

    // Injection des données utilisateur dans la requête Express
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de contrôle d'accès basé sur les rôles (RBAC).
 * @param allowedRoles Liste des rôles autorisés à accéder à la route.
 */
export const authorizeRoles = (...allowedRoles: (UserRole | string)[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Non authentifié.', 401));
    }

    const hasRole = allowedRoles.includes(req.user.role);
    if (!hasRole) {
      return next(
        new AppError('Vous ne disposez pas des permissions requises pour effectuer cette action.', 403)
      );
    }

    next();
  };
};
// import { Request, Response, NextFunction } from 'express';
// import { verifyToken } from '../lib/jwt';
// import jwt from 'jsonwebtoken';
// /**
//  * Middleware d'authentification JWT.
//  *
//  * Remplace `JwtAuthGuard` (NestJS) / la Strategie Passport.
//  * Extrait le token `Bearer`, le verifie et injecte `req.user` (JwtPayload).
//  */

// export interface JwtPayload {
//   sub: string;
//   email: string;
//   role: string;
//   universityId: string | null;
// }

// // Extension du type Request d'Express pour injecter req.user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: JwtPayload;
//     }
//   }
// }
// export const authenticateJWT = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): void => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     res.status(401).json({
//       success: false,
//       error: {
//         code: 'UNAUTHORIZED',
//         message: "Token d'authentification manquant ou format invalide.",
//       },
//     });
//     return;
//   }

//   const token = authHeader.split(' ')[1];
//   const secretKey = process.env.JWT_SECRET || 'super_secret_certiuni_key_2026';

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded; // Injection des donnees de l'utilisateur dans la requete
//     next();
//   } catch (error: any) {
//     if (error.name === 'TokenExpiredError') {
//       res.status(401).json({
//         success: false,
//         error: {
//           code: 'TOKEN_EXPIRED',
//           message: "L'Access Token a expire.",
//         },
//       });
//       return;
//     }

//     res.status(403).json({
//       success: false,
//       error: {
//         code: 'INVALID_TOKEN',
//         message: 'Signature ou structure du jeton corrompue.',
//       },
//     });
//   }
// };

// export default authenticateJWT;