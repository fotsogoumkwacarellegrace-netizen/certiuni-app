import { correlationIdMiddleware } from '../../src/middlewares/correlationId.middleware';

const mockReq = (headers: Record<string, string> = {}) => ({ headers } as never);
const mockRes = () => {
    const setHeader = jest.fn();
    return { res: { setHeader } as never, setHeader };
};

describe('correlationIdMiddleware', () => {
    it('génère un nouvel UUID si aucun header fourni', () => {
        const { res, setHeader } = mockRes();
        const next = jest.fn();
        const req = mockReq();

        correlationIdMiddleware(req, res, next);

        const headerVal = setHeader.mock.calls[0][1] as string;
        expect(headerVal).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect((req as any).correlationId).toBe(headerVal);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('réutilise le header X-Correlation-ID du client', () => {
        const { res, setHeader } = mockRes();
        const next = jest.fn();
        const req = mockReq({ 'x-correlation-id': 'client-corr-id-123' });

        correlationIdMiddleware(req, res, next);

        expect(setHeader).toHaveBeenCalledWith('X-Correlation-Id', 'client-corr-id-123');
        expect((req as any).correlationId).toBe('client-corr-id-123');
        expect(next).toHaveBeenCalled();
    });

    it('génère des IDs différents à chaque requête', () => {
        const a = mockRes();
        const b = mockRes();
        correlationIdMiddleware(mockReq(), a.res, jest.fn());
        correlationIdMiddleware(mockReq(), b.res, jest.fn());
        expect(a.setHeader.mock.calls[0][1]).not.toBe(b.setHeader.mock.calls[0][1]);
    });
});
