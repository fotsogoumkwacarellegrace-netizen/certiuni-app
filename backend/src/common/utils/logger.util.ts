import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { LoggerService, Injectable, Scope } from '@nestjs/common';

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

/**
 * Transport de rotation quotidienne pour les journaux de production.
 * Les fichiers sont archivÃ©s pendant 14 jours, puis automatiquement supprimÃ©s.
 * Chaque fichier est limitÃ© Ã 20 Mo avant rotation.
 */
const dailyRotateTransport = new (winston.transports as any).DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

/**
 * Transport de rotation dÃ©diÃ© aux erreurs critiques (isolÃ©es dans un fichier).
 * Conservation pendant 30 jours pour audit post-incident.
 */
const errorRotateTransport = new (winston.transports as any).DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
});

/**
 * Client Winston Singleton -- utilise partout dans le backend.
 *
 * - En production : sortie JSON structurÃ©e (machine-readable) + rotation quotidienne.
 * - En dÃ©veloppement : console colorÃ©e pour le debugging.
 *
 * Chaque entrÃ©e est enrichie de : timestamp, service, environment, pid.
 */
const logger = winston.createLogger({
    levels: logLevels,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format((info) => {
            info.service = 'certiuni-api';
            info.environment = process.env.NODE_ENV || 'development';
            info.pid = process.pid;
            return info;
        })(),
        winston.format.json(),
    ),
    defaultMeta: { service: 'certiuni-api' },
    transports: [dailyRotateTransport, errorRotateTransport],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    ({ timestamp, level, message, context, stack, ...meta }) => {
                        const ctx = context ? `[${context}] ` : '';
                        const errStack = stack ? '\n' + stack : '';
                        const metaStr =
                            Object.keys(meta).length > 0 ? ' ' + JSON.stringify(meta) : '';
                        return `${timestamp} ${level}: ${ctx}${message}${metaStr}${errStack}`;
                    },
                ),
            ),
        }),
    );
}

/**
 * StructuredLogger -- Service NestJS de logging structurÃ© basÃ© sur Winston.
 *
 * UtilisÃ© dans :
 *   - Le middleware de journalisation des requÃªtes HTTP (requestLogging.middleware.ts)
 *   - Le middleware global de gestion des erreurs (error.middleware.ts)
 *   - Les services mÃ©tier (AuditService, PaymentService, EmailService, NotificationService)
 *
 * MÃ©thodes : log(), error(), warn(), debug(), verbose()
 * Chaque appel accepte un contexte optionnel et des mÃ©tadonnÃ©es.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class StructuredLogger implements LoggerService {
    private logger: winston.Logger;
    private context?: string;

    constructor() {
        this.logger = logger;
    }

    setContext(context: string) {
        this.context = context;
    }

    log(message: string, context?: string, meta?: Record<string, unknown>) {
        this.logger.info(message, { context: context || this.context, ...meta });
    }

    error(message: string, trace?: string, context?: string, meta?: Record<string, unknown>) {
        this.logger.error(message, { stack: trace, context: context || this.context, ...meta });
    }

    warn(message: string, context?: string, meta?: Record<string, unknown>) {
        this.logger.warn(message, { context: context || this.context, ...meta });
    }

    debug(message: string, context?: string, meta?: Record<string, unknown>) {
        this.logger.debug(message, { context: context || this.context, ...meta });
    }

    verbose(message: string, context?: string, meta?: Record<string, unknown>) {
        this.logger.debug(message, { context: context || this.context, ...meta });
    }
}

export default logger;
