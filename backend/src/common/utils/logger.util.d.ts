import * as winston from 'winston';
import { LoggerService } from '@nestjs/common';
declare const logger: winston.Logger;
export declare class StructuredLogger implements LoggerService {
    private logger;
    private context?;
    constructor();
    setContext(context: string): void;
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
}
export default logger;
