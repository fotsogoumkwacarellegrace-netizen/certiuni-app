import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import * as crypto from 'crypto';

describe('CryptoService', () => {
    let service: CryptoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CryptoService],
        }).compile();

        service = module.get<CryptoService>(CryptoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateSha256Hash', () => {
        it('devrait générer un hash SHA-256 valide au format hexadécimal (64 caractères)', () => {
            const payload = {
                studentFirstName: 'Paul',
                studentLastName: 'Atreides',
                documentNumber: 'CERT-2026-001',
                degreeTitle: 'Master en Intelligence Artificielle',
            };

            const hash = service.generateSha256Hash(payload);

            expect(typeof hash).toBe('string');
            expect(hash).toHaveLength(64);
            expect(hash).toMatch(/^[a-f0-9]{64}$/i);
        });

        it('devrait produire le même hash pour les mêmes données en entrée (déterminisme)', () => {
            const payload = { id: '12345', code: 'UNI-DOUALA-2026' };

            const hash1 = service.generateSha256Hash(payload);
            const hash2 = service.generateSha256Hash(payload);

            expect(hash1).toBe(hash2);
        });

        it('devrait produire un hash différent en cas de modification minime des données', () => {
            const payloadA = { studentName: 'Jean Dupont', grade: 'A' };
            const payloadB = { studentName: 'Jean Dupont', grade: 'B' };

            const hashA = service.generateSha256Hash(payloadA);
            const hashB = service.generateSha256Hash(payloadB);

            expect(hashA).not.toBe(hashB);
        });
    });

    describe('verifySha256Hash', () => {
        it('devrait retourner true si le hash correspond exactement aux données', () => {
            const payload = { documentId: 'DOC-8899', issueYear: 2026 };
            const validHash = service.generateSha256Hash(payload);

            const isValid = service.verifySha256Hash(payload, validHash);

            expect(isValid).toBe(true);
        });

        it('devrait retourner false si le hash transmis ne correspond pas aux données', () => {
            const payload = { documentId: 'DOC-8899', issueYear: 2026 };
            const tamperedHash = '0000000000000000000000000000000000000000000000000000000000000000';

            const isValid = service.verifySha256Hash(payload, tamperedHash);

            expect(isValid).toBe(false);
        });
    });

    describe('signData & verifySignature (RSA / Digital Signature)', () => {
        let privateKey: string;
        let publicKey: string;

        beforeAll(() => {
            // Génération d'une paire de clés RSA temporaire pour le test
            const { privateKey: priv, publicKey: pub } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: { type: 'spki', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
            });
            privateKey = priv;
            publicKey = pub;
        });

        it('devrait signer des données avec une clé privée et vérifier la signature avec la clé publique', () => {
            const documentData = 'payload-du-diplome-certiuni-2026';

            const signature = service.signData(documentData, privateKey);

            expect(typeof signature).toBe('string');
            expect(signature.length).toBeGreaterThan(0);

            const isValid = service.verifySignature(documentData, signature, publicKey);
            expect(isValid).toBe(true);
        });

        it('devrait rejeter une signature si les données ont été altérées', () => {
            const originalData = 'payload-original-certiuni';
            const alteredData = 'payload-modifie-certiuni';

            const signature = service.signData(originalData, privateKey);

            const isValid = service.verifySignature(alteredData, signature, publicKey);
            expect(isValid).toBe(false);
        });
    });
});