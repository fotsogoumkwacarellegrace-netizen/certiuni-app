import { asyncHandler } from '../../src/lib/asyncHandler';

describe('asyncHandler', () => {
    it('exécute le handler et propage le résultat sans error', async () => {
        const next = jest.fn();
        const handler = asyncHandler(jest.fn().mockResolvedValue('ok'));
        await handler({} as never, {} as never, next);
        await new Promise((r) => setImmediate(r));
        expect(next).not.toHaveBeenCalled();
    });

    it('propage les rejets (throw) vers next(err)', async () => {
        const err = new Error('async-boom');
        const next = jest.fn();
        const handler = asyncHandler(async () => {
            throw err;
        });
        handler({} as never, {} as never, next);
        await new Promise((r) => setImmediate(r));
        expect(next).toHaveBeenCalledWith(err);
    });

    it('propage les rejets de promesse rejetée', async () => {
        const err = new Error('rejected');
        const next = jest.fn();
        const handler = asyncHandler(() => Promise.reject(err));
        handler({} as never, {} as never, next);
        await new Promise((r) => setImmediate(r));
        expect(next).toHaveBeenCalledWith(err);
    });
});
