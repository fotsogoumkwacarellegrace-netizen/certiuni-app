import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AuditLogInterceptor.name);

    constructor(private readonly prisma: PrismaService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip, user } = request;

        // Ne traquer que les actions de modification/création/suppression
        const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

        const startTime = Date.now();

        return next.handle().pipe(
            tap(async (responseData) => {
                if (!isMutation) return;

                const duration = Date.now() - startTime;
                const statusCode = context.switchToHttp().getResponse().statusCode;

                this.logger.log(
                    `[AUDIT] User: ${user?.id || 'ANONYMOUS'} | ${method} ${url} | Status: ${statusCode} | ${duration}ms`,
                );

                // Optionnel : persistance en BDD via le modèle AuditLog Prisma
                try {
                    await this.prisma.auditLog.create({
                        data: {
                            userId: user?.id || null,
                            action: `${method} ${url}`,
                            ipAddress: ip || request.headers['x-forwarded-for'] || '127.0.0.1',
                            statusCode,
                            payload: request.body ? JSON.stringify(request.body) : null,
                        },
                    });
                } catch (error) {
                    this.logger.error('Échec de la sauvegarde du log d\'audit', error);
                }
            }),
        );
    }
}