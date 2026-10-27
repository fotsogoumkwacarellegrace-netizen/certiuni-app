import { requestLoggingMiddleware } from '../../src/middlewares/requestLogging.middleware';
import logger from '../../src/common/utils/logger.util';

describe('requestLoggingMiddleware', () => {
    let logSpy: jest.SpyInstance;

    beforeEach(() => {
        logSpy = jest.spyOn(logger, 'log').mockImplementation(() => logger);
    });

    afterEach(() => {
        logSpy.mockRestore();
    });

    const buildReqRes = (overrides: Record<string, unknown> = {}) => {
        const finishHandlers: Array<() => void> = [];
        const req = {
            method: 'GET',
            originalUrl: '/api/v1/test',
            query: { page: '1' },
            ip: '127.0.0.1',
            get: jest.fn().mockReturnValue('jest-agent'),
            headers: {},
            ...overrides,
        } as never;
        const res = {
            statusCode: 200,
            on: jest.fn((event: string, cb: () => void) => {
                if (event === 'finish') finishHandlers.push(cb);
            }),
        } as never;
        return { req, res, finish: () => finishHandlers.forEach((cb) => cb()) };
    };

    it('appelle next() immédiatement', () => {
        const { req, res } = buildReqRes();
        const next = jest.fn();
        requestLoggingMiddleware(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('logge la requête après la réponse (event finish)', () => {
        const { req, res, finish } = buildReqRes({ correlationId: 'corr-1' });
        requestLoggingMiddleware(req, res, jest.fn());
        expect(logSpy).not.toHaveBeenCalled();
        finish();
        expect(logSpy).toHaveBeenCalledTimes(1);
        const [message, context, meta] = logSpy.mock.calls[0];
        expect(message).toContain('GET /api/v1/test 200');
        expect(context).toBe('HttpRequest');
        expect(meta.correlationId).toBe('corr-1');
        expect(meta.statusCode).toBe(200);
        expect(typeof meta.durationMs).toBe('number');
    });

    it('n\'inclut pas la query pour les uploads POST', () => {
        const { req, res, finish } = buildReqRes({ method: 'POST', originalUrl: '/api/v1/upload' });
        requestLoggingMiddleware(req, res, jest.fn());
        finish();
        const meta = logSpy.mock.calls[0][2];
        expect(meta.query).toBeUndefined();
    });
});
