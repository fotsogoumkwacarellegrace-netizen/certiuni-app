import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import redisClient from '../config/redis';

/**
 * Health router — liveness + readiness (K8s / Docker / LB probes).
 *
 *  - GET /            → liveness basique (processus vivant, sans dépendances).
 *  - GET /ready       → readiness : ping Postgres (SELECT 1) + ping Redis.
 *                       200 si tout est OK, 503 sinon avec détail par dépendance.
 *  - GET /health      → alias historique de readiness (compatibilité).
 *
 * Les sondes ne fuient aucun secret, uniquement des statuts booléens + latences.
 */
const router = Router();

router.get('/', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'certiuni-backend',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});

async function checkPostgres(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { ok: true, latencyMs: Date.now() - start };
    } catch (err) {
        return { ok: false, latencyMs: Date.now() - start, error: (err as Error).message };
    }
}

async function checkRedis(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
        const pong = await (redisClient as unknown as { ping: () => Promise<string> }).ping?.();
        const ok = !pong || pong.toUpperCase() === 'PONG';
        return { ok, latencyMs: Date.now() - start };
    } catch (err) {
        return { ok: false, latencyMs: Date.now() - start, error: (err as Error).message };
    }
}

async function readiness(_req: Request, res: Response) {
    const [db, redis] = await Promise.all([checkPostgres(), checkRedis()]);
    const allOk = db.ok && redis.ok;
    res.status(allOk ? 200 : 503).json({
        status: allOk ? 'ok' : 'degraded',
        service: 'certiuni-backend',
        checks: { postgres: db, redis },
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
}

router.get('/ready', readiness);
router.get('/health', readiness);

export default router;

