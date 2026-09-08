import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export interface ValidationTargets {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Middleware d'ordre supérieur effectuant la validation stricte des données entrantes avec Zod.
 * Peut valider simultanément req.body, req.query et req.params.
 */
export const validateRequest = (targetSchema: AnyZodObject | ValidationTargets) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Si un schéma Zod direct est transmis, on valide uniquement req.body par défaut
      if ('parseAsync' in targetSchema) {
        req.body = await targetSchema.parseAsync(req.body);
        return next();
      }

      // Validation modulaire pour body, query et params
      const targets = targetSchema as ValidationTargets;

      if (targets.body) {
        req.body = await targets.body.parseAsync(req.body);
      }

      if (targets.query) {
        req.query = await targets.query.parseAsync(req.query);
      }

      if (targets.params) {
        req.params = await targets.params.parseAsync(req.params);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formate les erreurs Zod dans un format d'API structuré et lisible
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          status: 'fail',
          message: 'Données de requête invalides.',
          errors: formattedErrors,
        });
        return;
      }

      return next(error);
    }
  };
};import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export interface ValidationTargets {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Middleware d'ordre supérieur effectuant la validation stricte des données entrantes avec Zod.
 * Peut valider simultanément req.body, req.query et req.params.
 */
export const validateRequest = (targetSchema: AnyZodObject | ValidationTargets) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Si un schéma Zod direct est transmis, on valide uniquement req.body par défaut
      if ('parseAsync' in targetSchema) {
        req.body = await targetSchema.parseAsync(req.body);
        return next();
      }

      // Validation modulaire pour body, query et params
      const targets = targetSchema as ValidationTargets;

      if (targets.body) {
        req.body = await targets.body.parseAsync(req.body);
      }

      if (targets.query) {
        req.query = await targets.query.parseAsync(req.query);
      }

      if (targets.params) {
        req.params = await targets.params.parseAsync(req.params);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formate les erreurs Zod dans un format d'API structuré et lisible
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          status: 'fail',
          message: 'Données de requête invalides.',
          errors: formattedErrors,
        });
        return;
      }

      return next(error);
    }
  };
};import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export interface ValidationTargets {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

/**
 * Middleware d'ordre supérieur effectuant la validation stricte des données entrantes avec Zod.
 * Peut valider simultanément req.body, req.query et req.params.
 */
export const validateRequest = (targetSchema: AnyZodObject | ValidationTargets) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Si un schéma Zod direct est transmis, on valide uniquement req.body par défaut
      if ('parseAsync' in targetSchema) {
        req.body = await targetSchema.parseAsync(req.body);
        return next();
      }

      // Validation modulaire pour body, query et params
      const targets = targetSchema as ValidationTargets;

      if (targets.body) {
        req.body = await targets.body.parseAsync(req.body);
      }

      if (targets.query) {
        req.query = await targets.query.parseAsync(req.query);
      }

      if (targets.params) {
        req.params = await targets.params.parseAsync(req.params);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formate les erreurs Zod dans un format d'API structuré et lisible
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          status: 'fail',
          message: 'Données de requête invalides.',
          errors: formattedErrors,
        });
        return;
      }

      return next(error);
    }
  };
};