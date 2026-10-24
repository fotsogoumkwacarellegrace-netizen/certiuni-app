import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    HealthCheckService,
    HealthCheck,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../common/prisma/prisma.service';
import { env } from '../../config/env.config';
import { IntegrationsRegistryService } from '../integrations/integrations-registry.service';
import { Public } from '../../common/decorators/public.decorator';

/**
 * HealthController — sondes liveness/readiness pour K8s, Docker et LB.
 *
 * - GET /api/v1/health        → check complet (DB + mémoire), 200/503.
 * - Terminus serialise déjà { status, info, error, details }.
 * - Le ping DB passe par PrismaService.ping() (SELECT 1).
 * - Seuils mémoire: heap 300MB, RSS 500MB (voir HEALTH_MEMORY_HEAP_THRESHOLD).
 */
@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly memory: MemoryHealthIndicator,
        private readonly prisma: PrismaService,
        private readonly integrationsRegistry: IntegrationsRegistryService,
    ) { }

    @Get()
    @HealthCheck()
    @ApiOperation({ summary: 'Vérifier l état de santé général du serveur et des dépendances' })
    @ApiResponse({ status: 200, description: 'Le système est fonctionnel (UP).' })
    @ApiResponse({ status: 503, description: 'Un ou plusieurs services sont indisponibles (DOWN).' })
    check() {
        return this.health.check([
            // 1. Vérification de la connexion à la base de données Prisma
            () => this.prisma.ping().then(() => ({ database: { status: 'up' as const } })),

            // 2. Vérification de l'utilisation de la mémoire Heap (défaut : 300 MB)
            () =>
                this.memory.checkHeap(
                    'memory_heap',
                    env.HEALTH_MEMORY_HEAP_THRESHOLD,
                ),

            // 3. Vérification de la mémoire RSS attribuée au processus (défaut : 500 MB)
            () =>
                this.memory.checkRSS(
                    'memory_rss',
                    env.HEALTH_MEMORY_RSS_THRESHOLD,
                ),
        ]);
    }

    @Get('capabilities')
    @ApiOperation({ summary: 'Lister les capacités configurées sans exposer les secrets' })
    capabilities() {
        return this.integrationsRegistry.getCapabilities();
    }
}
