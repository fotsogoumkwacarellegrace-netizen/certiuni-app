import {
    generateSha256,
    generateHmacSha256,
    generateRandomSalt,
    verifySha256,
} from '../../src/common/utils/crypto.util';

describe('Crypto Utils', () => {
    describe('generateSha256', () => {
        it('devrait generer un hash SHA-256 de 64 caracteres hexadecimaux pour une chaine', () => {
            const hash = generateSha256('hello world');
            expect(hash).toHaveLength(64);
            expect(hash).toMatch(/^[a-f0-9]{64}$/i);
        });

        it('devrait generer un hash SHA-256 pour un objet (JSON serialise)', () => {
            const obj = { name: 'test', value: 123 };
            const hash = generateSha256(obj);
            expect(hash).toHaveLength(64);
            expect(hash).toMatch(/^[a-f0-9]{64}$/i);
        });

        it('devrait generer un hash SHA-256 pour un Buffer', () => {
            const buffer = Buffer.from('test-content');
            const hash = generateSha256(buffer);
            expect(hash).toHaveLength(64);
        });

        it('devrait produire le meme hash pour la meme entree (determinisme)', () => {
            const hash1 = generateSha256('test-input');
            const hash2 = generateSha256('test-input');
            expect(hash1).toBe(hash2);
        });

        it('devrait produire un hash different pour des entrees differentes', () => {
            const hash1 = generateSha256('input-1');
            const hash2 = generateSha256('input-2');
            expect(hash1).not.toBe(hash2);
        });
    });

    describe('generateHmacSha256', () => {
        it('devrait generer un HMAC SHA-256 valide', () => {
            const hmac = generateHmacSha256('payload', 'secret-key');
            expect(hmac).toHaveLength(64);
            expect(hmac).toMatch(/^[a-f0-9]{64}$/i);
        });

        it('devrait produire le meme HMAC pour les memes entrees', () => {
            const hmac1 = generateHmacSha256('data', 'secret');
            const hmac2 = generateHmacSha256('data', 'secret');
            expect(hmac1).toBe(hmac2);
        });

        it('devrait produire un HMAC different avec des cles differentes', () => {
            const hmac1 = generateHmacSha256('data', 'secret1');
            const hmac2 = generateHmacSha256('data', 'secret2');
            expect(hmac1).not.toBe(hmac2);
        });
    });

    describe('generateRandomSalt', () => {
        it('devrait generer un sel de la longueur demandee (hexadecimal)', () => {
            const salt = generateRandomSalt(32);
            expect(salt).toHaveLength(64); // 32 bytes = 64 hex chars
            expect(salt).toMatch(/^[a-f0-9]{64}$/i);
        });

        it('devrait produire des sels differents a chaque appel', () => {
            const salt1 = generateRandomSalt(16);
            const salt2 = generateRandomSalt(16);
            expect(salt1).not.toBe(salt2);
        });

        it('devrait utiliser une longueur par defaut de 32', () => {
            const salt = generateRandomSalt();
            expect(salt).toHaveLength(64);
        });
    });

    describe('verifySha256', () => {
        it('devrait retourner true si le hash correspond aux donnees', () => {
            const data = 'my-data';
            const hash = generateSha256(data);
            expect(verifySha256(data, hash)).toBe(true);
        });

        it('devrait retourner false si le hash ne correspond pas', () => {
            const data = 'my-data';
            const wrongHash = '0'.repeat(64);
            expect(verifySha256(data, wrongHash)).toBe(false);
        });

        it('devrait retourner false pour des donnees modifiees', () => {
            const originalData = 'original';
            const hash = generateSha256(originalData);
            const modifiedData = 'modified';
            expect(verifySha256(modifiedData, hash)).toBe(false);
        });

        it('devrait supporter la verification d un objet', () => {
            const obj = { key: 'value', num: 42 };
            const hash = generateSha256(obj);
            expect(verifySha256(obj, hash)).toBe(true);
        });
    });
});
