import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { env } from '../../config/env.config';

/**
 * HttpExceptionFilter — filtre global NestJS (alias Express: globalErrorHandler).
 *
 * Contrat de réponse d'erreur unifié :
 *   { statusCode, status: 'fail'|'error', message, errors?, path, timestamp, correlationId? }
 *
 * Mapping :
 *  - HttpException / AppError-like (statusCode) → statut d'origine.
 *  - Prisma P2002 → 409 Conflict ; P2025 → 404 ; P2003 → 400.
 *  - ZodError → 400 avec détail champs.
 *  - JWT invalide/expiré → 401.
 *  - Défaut → 500 (stack masquée en production).
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request & { correlationId?: string }>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: string | object = 'Erreur interne du serveur';
        let errors: Array<{ field?: string; message: string }> | undefined;

        const exResponse = exception instanceof HttpException ? exception.getResponse() : null;
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            if (typeof exResponse === 'object' && exResponse !== null) {
                const r = exResponse as Record<string, unknown>;
                message = (r.message as string | object) || exResponse;
                if (Array.isArray(r.errors)) errors = r.errors as typeof errors;
            } else if (typeof exResponse === 'string') {
                message = exResponse;
            }
        } else if (exception instanceof Error) {
            const err = exception as Error & { statusCode?: number; code?: string; meta?: { target?: string[] }; errors?: Array<{ path: (string|number)[]; message: string }> };
            // Prisma known errors (sans import Prisma pour rester agnostique)
            if (err.code === 'P2002') {
                status = HttpStatus.CONFLICT;
                message = `Conflit: valeur déjà existante (${err.meta?.target?.join(', ') || 'champ unique'}).`;
            } else if (err.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                message = 'Enregistrement introuvable.';
            } else if (err.code === 'P2003') {
                status = HttpStatus.BAD_REQUEST;
                message = 'Contrainte de clé étrangère violée.';
            } else if (err.name === 'ZodError' && Array.isArray(err.errors)) {
                status = HttpStatus.BAD_REQUEST;
                message = 'Données de requête invalides.';
                errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
            } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                status = HttpStatus.UNAUTHORIZED;
                message = err.name === 'TokenExpiredError' ? 'Jeton expiré.' : 'Jeton invalide.';
            } else {
                if (typeof err.statusCode === 'number') status = err.statusCode;
                message = err.message || message;
            }
        }

        const correlationId = request.correlationId || (request.headers['x-correlation-id'] as string);
        const logMsg = `[${request.method}] ${request.url} -> ${status} :: ${JSON.stringify(message)}`;
        if (status >= 500) this.logger.error(logMsg, exception instanceof Error ? exception.stack : '');
        else this.logger.warn(logMsg);

        response.status(status).json({
            statusCode: status,
            status: `${status}`.startsWith('4') ? 'fail' : 'error',
            message,
            ...(errors ? { errors } : {}),
            path: request.url,
            ...(correlationId ? { correlationId } : {}),
            timestamp: new Date().toISOString(),
            ...(env.NODE_ENV === 'development' && exception instanceof Error ? { stack: exception.stack } : {}),
        });
    }
}
