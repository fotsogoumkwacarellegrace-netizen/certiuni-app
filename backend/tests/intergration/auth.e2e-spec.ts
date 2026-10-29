import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';

describe('Authentication (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    const testUser = {
        email: 'e2e.user@certiuni.cm',
        password: 'Password2026!',
        firstName: 'E2E',
        lastName: 'Tester',
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

        // Nettoyage et préparation de l'utilisateur de test
        await prisma.user.deleteMany({
            where: { email: testUser.email },
        });

        const hashedPassword = await argon2.hash(testUser.password);
        await prisma.user.create({
            data: {
                email: testUser.email,
                passwordHash: hashedPassword,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                role: 'SUPER_ADMIN',
            },
        });
    });

    afterAll(async () => {
        // Nettoyage après l'exécution des tests
        await prisma.user.deleteMany({
            where: { email: testUser.email },
        });
        await prisma.$disconnect();
        await app.close();
    });

    describe('POST /auth/login', () => {
        it('devrait retourner un jeton JWT et le profil utilisateur si les identifiants sont corrects', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
            expect(typeof response.body.accessToken).toBe('string');
            expect(response.body.user).toMatchObject({
                email: testUser.email,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
            });
            expect(response.body.user).not.toHaveProperty('passwordHash');
        });

        it('devrait retourner 401 Unauthorized si le mot de passe est incorrect', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'WrongPassword123!',
                })
                .expect(401);
        });

        it('devrait retourner 401 Unauthorized si l\'email n\'existe pas', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'unknown@certiuni.cm',
                    password: testUser.password,
                })
                .expect(401);
        });

        it('devrait retourner 400 Bad Request si les données envoyées sont invalides (DTO Validation)', async () => {
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'invalid-email-format',
                    password: '',
                })
                .expect(400);
        });
    });

    describe('GET /auth/me', () => {
        let accessToken: string;

        beforeEach(async () => {
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            accessToken = loginResponse.body.accessToken;
        });

        it('devrait retourner le profil courant si un jeton Bearer valide est fourni', async () => {
            const response = await request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toMatchObject({
                email: testUser.email,
                firstName: testUser.firstName,
                lastName: testUser.lastName,
                role: 'SUPER_ADMIN',
            });
        });

        it('devrait retourner 401 Unauthorized en l\'absence de jeton Bearer', async () => {
            await request(app.getHttpServer())
                .get('/auth/me')
                .expect(401);
        });

        it('devrait retourner 401 Unauthorized si le jeton Bearer est invalide', async () => {
            await request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', 'Bearer invalid.jwt.token')
                .expect(401);
        });
    });
});