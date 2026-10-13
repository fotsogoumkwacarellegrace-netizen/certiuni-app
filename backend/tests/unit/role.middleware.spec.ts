import { authorizeRoles } from '../../src/middlewares/role.middleware';
import { ForbiddenError } from '../../src/errors/app.error';

describe('authorizeRoles middleware', () => {
    const build = (user?: { role: string }) => {
        const req = { user } as never;
        const res = {} as never;
        const next = jest.fn();
        return { req, res, next };
    };

    it('next() sans erreur si le rôle est autorisé', () => {
        const { req, res, next } = build({ role: 'ADMIN' });
        authorizeRoles('ADMIN', 'ISSUER')(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('accepte l\'une des plusieurs valeurs autorisées', () => {
        const { req, res, next } = build({ role: 'ISSUER' });
        authorizeRoles('ADMIN', 'ISSUER')(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('ForbiddenError si non authentifié', () => {
        const { req, res, next } = build(undefined);
        authorizeRoles('ADMIN')(req, res, next);
        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
        expect((next.mock.calls[0][0] as ForbiddenError).statusCode).toBe(403);
    });

    it('ForbiddenError si rôle non autorisé (message avec le rôle)', () => {
        const { req, res, next } = build({ role: 'STUDENT' });
        authorizeRoles('ADMIN')(req, res, next);
        const err = next.mock.calls[0][0] as ForbiddenError;
        expect(err).toBeInstanceOf(ForbiddenError);
        expect(err.message).toContain('STUDENT');
    });
});
