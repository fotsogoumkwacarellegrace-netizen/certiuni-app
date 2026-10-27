import { StructuredLogger } from '../../src/common/utils/logger.util';

describe('StructuredLogger (NestJS LoggerService)', () => {
    let logger: StructuredLogger;
    let infoSpy: jest.SpyInstance;
    let warnSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;
    let debugSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new StructuredLogger();
        const w = (logger as any).logger;
        infoSpy = jest.spyOn(w, 'info').mockImplementation(() => w);
        warnSpy = jest.spyOn(w, 'warn').mockImplementation(() => w);
        errorSpy = jest.spyOn(w, 'error').mockImplementation(() => w);
        debugSpy = jest.spyOn(w, 'debug').mockImplementation(() => w);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('log() émet info avec le contexte', () => {
        logger.log('msg', 'Ctx');
        expect(infoSpy).toHaveBeenCalledWith('msg', expect.objectContaining({ context: 'Ctx' }));
    });

    it('setContext est utilisé quand aucun contexte n\'est passé', () => {
        logger.setContext('MyCtx');
        logger.log('hello');
        expect(infoSpy).toHaveBeenCalledWith('hello', expect.objectContaining({ context: 'MyCtx' }));
    });

    it('error() émet error avec stack + meta', () => {
        logger.error('failure', 'stack-trace', 'ErrCtx', { code: 42 });
        expect(errorSpy).toHaveBeenCalledWith(
            'failure',
            expect.objectContaining({ stack: 'stack-trace', context: 'ErrCtx', code: 42 }),
        );
    });

    it('warn()/debug() deleguent aux transports winston', () => {
        logger.warn('w');
        logger.debug('d');
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(debugSpy).toHaveBeenCalledTimes(1);
    });

    it('verbose() est redirige vers debug (niveaux custom sans verbose)', () => {
        logger.verbose('v', 'VCtx');
        expect(debugSpy).toHaveBeenCalledWith('v', expect.objectContaining({ context: 'VCtx' }));
    });

    it('fusionne les métadonnées arbitraires', () => {
        logger.log('m', 'C', { userId: 'u9', correlationId: 'c9' });
        expect(infoSpy).toHaveBeenCalledWith(
            'm',
            expect.objectContaining({ userId: 'u9', correlationId: 'c9' }),
        );
    });
});
