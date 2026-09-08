import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_tres_securise_certiuni';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Accès non autorisé',
      message: 'Jeton d\'authentification manquant ou format invalide.'
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded; // Injection des données de l'utilisateur dans la requête
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Jeton expiré',
        message: 'L\'Access Token a expiré. Veuillez utiliser le Refresh Token.'
      });
      return;
    }

    res.status(403).json({
      error: 'Jeton invalide',
      message: 'Signature ou structure du jeton corrompue.'
    });
  }
};