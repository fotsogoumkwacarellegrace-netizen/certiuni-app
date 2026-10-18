import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';

describe('Certificates Management (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let adminToken: string;
    let universityId: string;
    let createdCertificateId: string;

    const adminUser = {
        email: 'cert.admin@certiuni.cm',
        password: 'Password2026!',
        firstName: 'Cert',
        lastName: 'Admin',
    };

    const sampleCertificate = {
        studentFirstName: 'Emmanuel',
        studentLastName: 'Eto\'o',
        studentBirthDate: '1998-11-23',
        studentIdNumber: 'MAT-2026-8899',
        degreeTitle: 'Master en Génie Logiciel',
        speciality: 'Architecture Système & Sécurité',
        issueDate: '2026-06-30',
    };

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
        await prisma.user.deleteMany({ where: { email: adminUser.email } });
        await prisma.university.deleteMany({ where: { code: 'UNI-CERT-TEST' } });

        // Création d'une université de test
        const university = await prisma.university.create({
            data: {
                name: 'Université de Test Certification',
                code: 'UNI-CERT-TEST',
            },
        });
        universityId = university.id;

        // Création de l'administrateur
        const hashedPassword = await argon2.hash(adminUser.password);
        await prisma.user.create({
            data: {
                email: adminUser.email,
                passwordHash: hashedPassword,
                firstName: adminUser.firstName,
                lastName: adminUser.lastName,
                role: 'UNIVERSITY_ADMIN',
                universityId,
            },
        });

        // Authentification pour obtenir le jeton Bearer
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: adminUser.email,
                password: adminUser.password,
            });

        adminToken = loginResponse.body.accessToken;
    });

    afterAll(async () => {
        await prisma.certificate.deleteMany();
        await prisma.user.deleteMany({ where: { email: adminUser.email } });
        await prisma.university.deleteMany({ where: { id: universityId } });
        await prisma.$disconnect();
        await app.close();
    });

    describe('POST /certificates (Émission de diplôme)', () => {
        it('devrait interdire la création d\'un diplôme sans authentification (401 Unauthorized)', async () => {
            await request(app.getHttpServer())
                .post('/certificates')
                .send(sampleCertificate)
                .expect(401);
        });

        it('devrait émettre un nouveau diplôme avec son numéro unique et le hash SHA-256', async () => {
            const response = await request(app.getHttpServer())
                .post('/certificates')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    ...sampleCertificate,
                    universityId,
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('documentNumber');
            expect(response.body).toHaveProperty('digitalHash');
            expect(response.body.isRevoked).toBe(false);
            expect(response.body.studentFirstName).toBe(sampleCertificate.studentFirstName);

            createdCertificateId = response.body.id;
        });

        it('devrait échouer avec un statut 400 si des champs obligatoires sont manquants', async () => {
            await request(app.getHttpServer())
                .post('/certificates')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    studentFirstName: 'Incomplet',
                })
                .expect(400);
        });
    });

    describe('GET /certificates/:id (Détails du diplôme)', () => {
        it('devrait retourner les informations d\'un diplôme existant', async () => {
            const response = await request(app.getHttpServer())
                .get(`/certificates/${createdCertificateId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body.id).toBe(createdCertificateId);
            expect(response.body.studentIdNumber).toBe(sampleCertificate.studentIdNumber);
        });

        it('devrait retourner 404 Not Found si l\'ID n\'existe pas', async () => {
            await request(app.getHttpServer())
                .get('/certificates/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(404);
        });
    });

    describe('GET /certificates/:id/pdf (Génération/Téléchargement du PDF)', () => {
        it('devrait générer et retourner le fichier PDF du diplôme', async () => {
            const response = await request(app.getHttpServer())
                .get(`/certificates/${createdCertificateId}/pdf`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.headers['content-type']).toContain('application/pdf');
            expect(Buffer.isBuffer(response.body)).toBe(true);
        });
    });

    describe('PATCH /certificates/:id/revoke (Révocation)', () => {
        it('devrait révoquer un diplôme existant avec un motif explicite', async () => {
            const revocationReason = 'Erreur d\'attribution de notes détectée après audit';

            const response = await request(app.getHttpServer())
                .patch(`/certificates/${createdCertificateId}/revoke`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    revocationReason,
                })
                .expect(200);

            expect(response.body.id).toBe(createdCertificateId);
            expect(response.body.isRevoked).toBe(true);
            expect(response.body.revocationReason).toBe(revocationReason);
            expect(response.body).toHaveProperty('revokedAt');
        });

        it('devrait échouer à révoquer un diplôme déjà révoqué (400 Bad Request)', async () => {
            await request(app.getHttpServer())
                .patch(`/certificates/${createdCertificateId}/revoke`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    revocationReason: 'Deuxième tentative de révocation',
                })
                .expect(400);
        });
    });
});