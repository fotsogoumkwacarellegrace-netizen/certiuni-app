import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';

// Modules minimaux nécessaires pour le health check
import { HealthModule } from '../src/modules/health/health.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

/**
 * Smoke-test e2e du endpoint /health.
 *
 * - PrismaService est overridé : aucun besoin de base de données réelle.
 * - TerminusModule est fourni par HealthModule lui-même (on ne redéclare PAS
 *   HealthCheckService/MemoryIndicator ici : cela créerait un alias circulaire).
 * - Aucun intercepteur global : on vérifie le format brut de Terminus
 *   ({ status, info, ... }).
 */
const mockPrismaService = {
    ping: jest.fn().mockResolvedValue(undefined),
    $queryRaw: jest.fn().mockResolvedValue([]),
};

describe('Health (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [HealthModule],
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    it('/health (GET) - doit retourner le statut de l\'application', () => {
        return request(app.getHttpServer())
            .get('/health')
            .expect(200)
            .expect((res) => {
                expect(res.body.status).toBe('ok');
            });
    });

    it('/health (GET) - doit exposer les infos DB et mémoire', async () => {
        const res = await request(app.getHttpServer()).get('/health').expect(200);

        expect(res.body.status).toBe('ok');
        expect(res.body.info).toBeDefined();
        expect(res.body.info.database.status).toBe('up');
        expect(res.body.info.memory_heap.status).toBe('up');
        expect(res.body.info.memory_rss.status).toBe('up');
        // Le mock Prisma.ping() doit avoir été appelé par le check DB.
        expect(mockPrismaService.ping).toHaveBeenCalled();
    });
});
