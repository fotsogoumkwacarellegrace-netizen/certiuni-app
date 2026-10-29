import { authenticateJwt } from '../../src/middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../src/errors/app.error';

jest.mock('../../src/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
    },
}));

import { prisma } from '../../src/lib/prisma';

const SECRET = process.env.JWT_ACCESS_SECRET || 'certiuni-dev-secret';
const findUnique = prisma.user.findUnique as jest.Mock;

describe('authenticateJwt middleware', () => {
    const build = (authorization?: string) => {
        const req = { headers: authorization ? { authorization } : {} } as never;
        const res = {} as never;
        const next = jest.fn();
        return { req, res, next };
    };

    beforeEach(() => {
        jest.clearAllMocks();
        findUnique.mockResolvedValue({
            id: 'u1',
            email: 'a@b.co',
            role: 'ADMIN',
            universityId: null,
            isActive: true,
        });
    });

    it('401 si header Authorization manquant', async () => {
        const { req, res, next } = build();
        await authenticateJwt(req, res, next);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(UnauthorizedError);
        expect(err.message).toContain('manquant');
        expect(findUnique).not.toHaveBeenCalled();
    });

    it('401 si header sans prefixe Bearer', async () => {
        const { req, res, next } = build('Token abc');
        await authenticateJwt(req, res, next);
        expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });

    it('401 si token invalide', async () => {
        const { req, res, next } = build('Bearer not.a.jwt');
        await authenticateJwt(req, res, next);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(UnauthorizedError);
        expect(err.message).toContain('invalide ou expiré');
        expect(findUnique).not.toHaveBeenCalled();
    });

    it('injecte req.user + next() sans erreur pour un token valide', async () => {
        const token = jwt.sign({ id: 'u1', email: 'a@b.co', role: 'ADMIN' }, SECRET);
        const { req, res, next } = build(`Bearer ${token}`);
        await authenticateJwt(req, res, next);
        expect(next).toHaveBeenCalledWith();
        expect((req as any).user).toMatchObject({ id: 'u1', email: 'a@b.co', role: 'ADMIN' });
        expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'u1' } }));
    });

    it('401 si le compte est désactivé', async () => {
        findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.co', role: 'ADMIN', universityId: null, isActive: false });
        const token = jwt.sign({ id: 'u1', email: 'a@b.co', role: 'ADMIN' }, SECRET);
        const { req, res, next } = build(`Bearer ${token}`);
        await authenticateJwt(req, res, next);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(UnauthorizedError);
        expect(err.message).toContain('désactivé');
    });

    it('401 si l\'utilisateur n\'existe plus en base', async () => {
        findUnique.mockResolvedValue(null);
        const token = jwt.sign({ id: 'ghost', email: 'g@b.co', role: 'ADMIN' }, SECRET);
        const { req, res, next } = build(`Bearer ${token}`);
        await authenticateJwt(req, res, next);
        expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });
});
