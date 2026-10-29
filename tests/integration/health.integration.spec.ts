import request from 'supertest';
import app from '../../src/app';

/**
 * Tests d'intégration Express — SANS base de données ni Redis.
 *
 * Couverture :
 *  - route racine d'information (liveness applicative)
 *  - health liveness (/api/v1/health/) : ne dépend d'aucune infra
 *  - enveloppe 404 du catch-all + globalErrorHandler
 *  - header X-Correlation-Id propagé par correlationIdMiddleware
 *
 * NB : /ready et /health (readiness) pingent Postgres/Redis et sont couverts
 * par les probes d'infrastructure (docker/k8s), pas par ces tests.
 */
describe('health + root (integration, no DB)', () => {
    it('GET / -> running', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('running');
    });

    it('GET /api/v1/health/ -> ok (liveness sans dependances)', async () => {
        const res = await request(app).get('/api/v1/health/');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('certiuni-backend');
    });

    it('unknown route -> 404 enveloppe error', async () => {
        const res = await request(app).get('/api/v1/nope-xyz');
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('fail');
        expect(res.body.message).toContain('nope-xyz');
    });

    it('sets X-Correlation-Id', async () => {
        const res = await request(app).get('/');
        expect(res.headers['x-correlation-id']).toBeDefined();
    });

    it('reutilise le X-Correlation-ID fourni par le client', async () => {
        const res = await request(app).get('/').set('X-Correlation-ID', 'trace-123');
        expect(res.headers['x-correlation-id']).toBe('trace-123');
    });

    it('racine renvoie les metadonnees de service', async () => {
        const res = await request(app).get('/');
        expect(res.body).toMatchObject({ name: 'CertiUni API', status: 'running' });
        expect(typeof res.body.version).toBe('string');
        expect(typeof res.body.timestamp).toBe('string');
    });

    it('repond aux headers de securite helmet', async () => {
        const res = await request(app).get('/');
        expect(res.headers['x-powered-by']).toBeUndefined();
        expect(res.headers['x-content-type-options']).toBe('nosniff');
    });
});
