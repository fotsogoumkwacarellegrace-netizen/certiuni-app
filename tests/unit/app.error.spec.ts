import { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, InternalServerError } from '../../src/errors/app.error';

describe('AppError & Custom Error Classes', () => {
    describe('AppError', () => {
        it('devrait creer une erreur avec le code de statut et le statut fournis', () => {
            const error = new AppError('Test message', 400);
            expect(error.message).toBe('Test message');
            expect(error.statusCode).toBe(400);
            expect(error.status).toBe('fail');
            expect(error.isOperational).toBe(true);
        });

        it('devrait definir status a "error" pour les codes 5xx', () => {
            const error = new AppError('Server crash', 500);
            expect(error.status).toBe('error');
        });

        it('devrait preserver la pile d appels (stack trace)', () => {
            const error = new AppError('With stack', 400);
            expect(error.stack).toBeDefined();
            expect(typeof error.stack).toBe('string');
        });

        it('devrait etre une instance de Error', () => {
            const error = new AppError('Test', 400);
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('BadRequestError', () => {
        it('devrait utiliser le message par defaut "Requête invalide."', () => {
            const error = new BadRequestError();
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe('Requête invalide.');
            expect(error.status).toBe('fail');
        });

        it('devrait accepter un message personnalise', () => {
            const error = new BadRequestError('Donnees manquantes');
            expect(error.message).toBe('Donnees manquantes');
        });
    });

    describe('UnauthorizedError', () => {
        it('devrait retourner 401 avec le message par defaut', () => {
            const error = new UnauthorizedError();
            expect(error.statusCode).toBe(401);
            expect(error.message).toBe('Accès non autorisé. Authentification requise.');
        });
    });

    describe('ForbiddenError', () => {
        it('devrait retourner 403', () => {
            const error = new ForbiddenError('Acces refuse');
            expect(error.statusCode).toBe(403);
            expect(error.message).toBe('Acces refuse');
        });
    });

    describe('NotFoundError', () => {
        it('devrait retourner 404 avec le message par defaut', () => {
            const error = new NotFoundError();
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Ressource introuvable.');
        });
    });

    describe('ConflictError', () => {
        it('devrait retourner 409', () => {
            const error = new ConflictError('Conflit de donnees');
            expect(error.statusCode).toBe(409);
            expect(error.message).toBe('Conflit de donnees');
        });
    });

    describe('InternalServerError', () => {
        it('devrait retourner 500 avec status "error"', () => {
            const error = new InternalServerError();
            expect(error.statusCode).toBe(500);
            expect(error.status).toBe('error');
            expect(error.message).toBe('Une erreur interne du serveur est survenue.');
        });
    });
});

describe('ERROR_CODES constants', () => {
    const ERROR_CODES = require('../../src/constants/errorCodes').ERROR_CODES;

    it('devrait definir tous les codes d erreur attendus', () => {
        expect(ERROR_CODES).toEqual({
            AUTH_REQUIRED: 'AUTH_REQUIRED',
            INVALID_TOKEN: 'INVALID_TOKEN',
            FORBIDDEN: 'FORBIDDEN',
            NOT_FOUND: 'NOT_FOUND',
            INVALID_REQUEST: 'INVALID_REQUEST',
            DUPLICATE: 'DUPLICATE',
            INTERNAL_ERROR: 'INTERNAL_ERROR',
        });
    });
});
