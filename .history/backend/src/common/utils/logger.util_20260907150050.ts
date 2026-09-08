import * as winston from 'winston';
// import { env // } from '../config/env.config';
import { LoggerService, Injectable, Scope } from '@nestjs/common';

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

const logger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'certiuni-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

@Injectable({ scope: Scope.TRANSIENT })
export class StructuredLogger implements LoggerService {
    private logger: winston.Logger;
    private context?: string;

    constructor() {
        this.logger = winston.createLogger({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                process.env.NODE_ENV === 'production'
                    ? winston.format.json()
                    : winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(({ timestamp, level, message, context, stack }) => {
                            const ctx = context ? `[${context}] ` : '';
                            const errStack = stack ? `\n${stack}` : '';
                            return `${timestamp} ${level}: ${ctx}${message}${errStack}`;
                        }),
                    ),
            ),
            transports: [new winston.transports.Console()],
        });
    }

    setContext(context: string) {
        this.context = context;
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context: context || this.context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { stack: trace, context: context || this.context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context: context || this.context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context: context || this.context });
    }
}

export default logger;