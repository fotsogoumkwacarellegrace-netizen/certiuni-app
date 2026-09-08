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