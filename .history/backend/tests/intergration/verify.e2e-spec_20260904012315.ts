import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as crypto from 'crypto';

describe('Public Verification API (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let universityId: string;
    let validCertId: string;
    let validDocNumber: string;
    let validDigitalHash: string;

    let revokedCertId: string;
    let revokedDocNumber: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
        prisma = app.get<PrismaService>(PrismaService);

        // Nettoyage préalable
        await prisma.certificate.deleteMany();
        await prisma.university.deleteMany({ where: { code: 'UNI-VERIFY-TEST' } });

        // Création d'une université de test
        const university = await prisma.university.create({
            data: {
                name: 'Université de Vérification Publique',
                code: 'UNI-VERIFY-TEST',
            },
        });
        universityId = university.id;

        // 1. Création d'un diplôme VALIDE
        validDocNumber = 'CERT-2026-VAL-001';
        validDigitalHash = crypto.createHash('sha256').update('valid-cert-data-payload').digest('hex');

        const validCert = await prisma.certificate.create({
            data: {
                documentNumber: validDocNumber,
                digitalHash: validDigitalHash,
                studentFirstName: 'Claire',
                studentLastName: 'Mbala',
                studentBirthDate: new Date('1999-04-12'),
                studentIdNumber: 'MAT-2026-901',
                degreeTitle: 'Master en Cybersécurité',
                speciality: 'Cryptographie & Sécurité Système',
                issueDate: new Date('2026-07-01'),
                isRevoked: false,
                universityId,
            },
        });
        validCertId = validCert.id;

        // 2. Création d'un diplôme RÉVOQUÉ
        revokedDocNumber = 'CERT-2026-REV-999';
        const revokedDigitalHash = crypto.createHash('sha256').update('revoked-cert-data-payload').digest('hex');

        const revokedCert = await prisma.certificate.create({
            data: {
                documentNumber: revokedDocNumber,
                digitalHash: revokedDigitalHash,
                studentFirstName: 'Marc',
                studentLastName: 'Nkoa',
                studentBirthDate: new Date('1997-09-05'),
                studentIdNumber: 'MAT-2026-902',
                degreeTitle: 'Licence en Finance',
                speciality: 'Audit',
                issueDate: new Date('2025-06-30'),
                isRevoked: true,
                revocationReason: 'Diplôme annulé suite à une fraude documentaire constatée.',
                revokedAt: new Date(),
                universityId,
            },
        });
        revokedCertId = revokedCert.id;
    });

    afterAll(async () => {
        await prisma.certificate.deleteMany();
        await prisma.university.deleteMany({ where: { id: universityId } });
        await prisma.$disconnect();
        await app.close();
    });

    describe('GET /verify/:identifier (Résolution publique par ID ou Numéro de Document)', () => {
        it('devrait retourner le statut "VALID" et les informations du diplôme si valide', async () => {
            const response = await request(app.getHttpServer())
                .get(`/verify/${validDocNumber}`)
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'VALID',
                isValid: true,
                isRevoked: false,
                certificate: {
                    id: validCertId,
                    documentNumber: validDocNumber,
                    studentFirstName: 'Claire',
                    studentLastName: 'Mbala',
                    degreeTitle: 'Master en Cybersécurité',
                    universityName: 'Université de Vérification Publique',
                },
            });
        });

        it('devrait retourner le statut "REVOKED" avec le motif si le diplôme a été révoqué', async () => {
            const response = await request(app.getHttpServer())
                .get(`/verify/${revokedDocNumber}`)
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'REVOKED',
                isValid: false,
                isRevoked: true,
                revocationReason: 'Diplôme annulé suite à une fraude documentaire constatée.',
                certificate: {
                    id: revokedCertId,
                    documentNumber: revokedDocNumber,
                },
            });
        });

        it('devrait retourner 404 Not Found si aucun diplôme ne correspond au numéro transmis', async () => {
            const response = await request(app.getHttpServer())
                .get('/verify/CERT-0000-NON-EXISTENT')
                .expect(404);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('POST /verify/hash (Vérification par empreinte cryptographique SHA-256)', () => {
        it('devrait confirmer l\'authenticité à partir du hash SHA-256 exact', async () => {
            const response = await request(app.getHttpServer())
                .post('/verify/hash')
                .send({
                    hash: validDigitalHash,
                })
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'VALID',
                isValid: true,
                certificate: {
                    documentNumber: validDocNumber,
                    digitalHash: validDigitalHash,
                },
            });
        });

        it('devrait indiquer un statut "NOT_FOUND" ou retourner 404 si le hash est introuvable', async () => {
            const unknownHash = crypto.createHash('sha256').update('unknown-payload').digest('hex');

            await request(app.getHttpServer())
                .post('/verify/hash')
                .send({
                    hash: unknownHash,
                })
                .expect(404);
        });

        it('devrait rejeter les requêtes dont le format du hash est invalide (Bad Request 400)', async () => {
            await request(app.getHttpServer())
                .post('/verify/hash')
                .send({
                    hash: 'invalid-sha256-format',
                })
                .expect(400);
        });
    });
});