import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import {
    HealthCheckService,
    HealthCheck,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * HealthController — sondes liveness/readiness pour K8s, Docker et LB.
 *
 * - GET /api/v1/health        → check complet (DB + mémoire), 200/503.
 * - Terminus serialise déjà { status, info, error, details }.
 * - Le ping DB passe par PrismaService.ping() (SELECT 1).
 * - Seuils mémoire: heap 300MB, RSS 500MB (voir HEALTH_MEMORY_HEAP_THRESHOLD).
 */
@ApiTags('Health')
@Public() // Sonde publique pour K8s/Docker/LB — pas d'auth requise
@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly memory: MemoryHealthIndicator,
        private readonly prisma: PrismaService,
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
                    HealthController.threshold('HEALTH_MEMORY_HEAP_THRESHOLD', 300 * 1024 * 1024),
                ),

            // 3. Vérification de la mémoire RSS attribuée au processus (défaut : 500 MB)
            () =>
                this.memory.checkRSS(
                    'memory_rss',
                    HealthController.threshold('HEALTH_MEMORY_RSS_THRESHOLD', 500 * 1024 * 1024),
                ),
        ]);
    }

    /**
     * Lit un seuil mémoire exprimé en OCTETS depuis l'environnement
     * (cf. `.env.example` : HEALTH_MEMORY_HEAP_THRESHOLD=150000000).
     * - Non défini / invalide → valeur par défaut en bytes.
     * Les tests e2e surchargent ces variables pour éviter les 503 dûs à la
     * consommation mémoire des workers Jest.
     */
    private static threshold(envVar: string, defaultBytes: number): number {
        const raw = process.env[envVar];
        const parsed = raw !== undefined ? parseInt(raw, 10) : NaN;
        return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultBytes;
    }
}
