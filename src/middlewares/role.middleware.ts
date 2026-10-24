import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/app.error';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ForbiddenError('Non authentifié. Veuillez vous connecter pour accéder à cette ressource.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Votre rôle (${req.user.role}) ne vous permet pas d'effectuer cette action.`));
    }

    next();
  };
};