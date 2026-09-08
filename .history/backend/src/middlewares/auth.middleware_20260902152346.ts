import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError, UnauthorizedError } from '../errors/app.error';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  universityId?: string | null;
  iat?: number;
  exp?: number;
  firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
}

export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'certiuni-dev-secret'
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, universityId: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Utilisateur inconnu ou compte désactivé.');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new UnauthorizedError('Jeton d\'accès invalide ou expiré.'));
  }
};

export const authenticateJWT = authenticateJwt;

