import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Enveloppe un handler async Express pour transmettre les rejets
 * (throw) vers le middleware d'erreurs.
 *
 * Remplace le comportement natif de NestJS qui capte automatiquement les
 * exceptions levées dans les handlers async.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
