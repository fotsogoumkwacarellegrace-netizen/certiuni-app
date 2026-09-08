import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    HealthCheckService,
    HealthCheck,
    PrismaHealthIndicator,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly prismaHealth: PrismaHealthIndicator,
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
            () => this.prismaHealth.pingCheck('database', this.prisma),

            // 2. Vérification de l'utilisation de la mémoire Heap (Seuil max: 300 MB)
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),

            // 3. Vérification de la mémoire RSS attribuée au processus (Seuil max: 500 MB)
            () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
        ]);
    }
}