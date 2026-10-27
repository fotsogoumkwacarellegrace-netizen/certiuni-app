import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Middleware d'ID de corrélation.
 *
 * Injecte un identifiant unique (UUID v4) sur chaque requête entrante :
 *   - Si le client fournit un header `X-Correlation-ID`, il est réutilisé.
 *   - Sinon, un nouvel ID est généré.
 *
 * Cet ID est ajouté à :
 *   - `req.correlationId` (propriété personnalisée)
 *   - `res.setHeader('X-Correlation-Id', correlationId)` (retourné au client)
 *
 * Il permet de tracer un flux de requête→réponse à travers tous les services
 * (API Gateway, backend, worker, base de données) pour le debugging distribué.
 */
export const correlationIdMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const correlationId =
        (req.headers['x-correlation-id'] as string) || randomUUID();

    (req as any).correlationId = correlationId;

    res.setHeader('X-Correlation-Id', correlationId);

    next();
};
