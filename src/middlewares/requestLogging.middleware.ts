import { Request, Response, NextFunction } from 'express';
import logger from '../common/utils/logger.util';

/**
 * Middleware de journalisation des requêtes HTTP.
 *
 * Enregistre chaque requête entrante et sa réponse avec :
 *   - La méthode HTTP et le chemin
 *   - Le code de statut HTTP
 *   - La durée de traitement (ms)
 *   - L'adresse IP du client
 *   - Le user-agent
 *   - L'ID de corrélation (correlationId) injecté par le middleware correlationId
 *
 * En production, les logs sont en JSON (machine-readable).
 * En développement, les logs sont colorisés dans la console.
 *
 * @see correlationId.middleware.ts — injecte l'ID de corrélation sur chaque requête
 */
export const requestLoggingMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const startTime = Date.now();

    // Écoute de l'événement de fin de réponse pour logger après l'envoi
    res.on('finish', () => {
        const durationMs = Date.now() - startTime;
        const statusCode = res.statusCode;

        const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

        const logData: Record<string, unknown> = {
            method: req.method,
            url: req.originalUrl,
            statusCode,
            durationMs,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            correlationId: (req as any).correlationId,
            userId: (req as any).user?.id,
        };

        // N'inclut pas le body pour les requêtes volumineuses (upload de fichiers)
        if (req.method !== 'POST' || !req.originalUrl.includes('upload')) {
            logData.query = req.query;
        }

        logger.log(
            `[HTTP] ${req.method} ${req.originalUrl} ${statusCode} - ${durationMs}ms`,
            'HttpRequest',
            logData,
        );
    });

    next();
};
