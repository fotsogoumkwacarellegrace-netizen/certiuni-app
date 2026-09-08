import { Request, Response, NextFunction } from 'express';
import { RoleEnum } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/app.error';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Vous ne possédez pas les droits nécessaires pour cette opération.'));
    }
    next();
  };
};
export const authorizeRoles = (...allowedRoles: RoleEnum[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Non authentifié',
        message: 'Veuillez vous connecter pour accéder à cette ressource.'
      });
      return;
    }

    // Vérification du rôle dans la liste autorisée
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Accès interdit',
        message: `Votre rôle (${req.user.role}) ne vous permet pas d'effectuer cette action.`
      });
      return;
    }

    next();
  };
};