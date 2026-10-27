import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService — client Prisma singleton (pattern NestJS officiel).
 *
 * Cycle de vie :
 *  - onModuleInit    → ouvre la connexion poolée (PgBouncer en prod).
 *  - onModuleDestroy → ferme proprement (graceful shutdown).
 *  - enableShutdownHooks dans main.ts pour SIGTERM/SIGINT.
 *
 * Logging requêtes :
 *  - dev  → ['query','info','warn','error'] pour debug SQL.
 *  - prod → ['error'] uniquement (perf + bruit réduit, APM via logs JSON).
 */
@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Prisma connected');
        } catch (err) {
            this.logger.error(`Prisma connect failed: ${(err as Error).message}`);
            throw err;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    /** Ping DB pour health-checks / readiness probes. */
    async ping(): Promise<void> {
        await this.$queryRaw`SELECT 1`;
    }
}
