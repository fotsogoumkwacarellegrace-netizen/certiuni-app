import { validateRequest } from '../../src/middlewares/validate.middleware';
import { z } from 'zod';

describe('validateRequest middleware', () => {
    const build = () => {
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const res = { status } as never;
        return { res, json, status };
    };

    it('valide req.body avec un schéma Zod direct et remplace le body', async () => {
        const schema = z.object({ name: z.string() });
        const req = { body: { name: 'Alice' } } as never;
        const { res } = build();
        const next = jest.fn();

        await validateRequest(schema)(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect((req as any).body).toEqual({ name: 'Alice' });
    });

    it('rejette un body invalide → 400 structuré', async () => {
        const schema = z.object({ name: z.string() });
        const req = { body: { name: 42 } } as never;
        const { res, status, json } = build();
        const next = jest.fn();

        await validateRequest(schema)(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(400);
        const body = json.mock.calls[0][0];
        expect(body.status).toBe('fail');
        expect(body.errors[0].field).toBe('name');
    });

    it('valide body + query + params (cible modulaire)', async () => {
        const middleware = validateRequest({
            body: z.object({ email: z.string().email() }),
            query: z.object({ page: z.string() }),
            params: z.object({ id: z.string().uuid() }),
        });
        const req = {
            body: { email: 'a@b.co' },
            query: { page: '2' },
            params: { id: '00000000-0000-4000-8000-000000000000' },
        } as never;
        const { res } = build();
        const next = jest.fn();

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect((req as any).query).toEqual({ page: '2' });
        expect((req as any).params.id).toBe('00000000-0000-4000-8000-000000000000');
    });

    it('transmet les erreurs non-Zod à next(error)', async () => {
        const boom = new Error('boom');
        const failingSchema = {
            parseAsync: jest.fn().mockRejectedValue(boom),
        } as never;
        const req = { body: {} } as never;
        const { res } = build();
        const next = jest.fn();

        await validateRequest(failingSchema)(req, res, next);

        expect(next).toHaveBeenCalledWith(boom);
    });
});
