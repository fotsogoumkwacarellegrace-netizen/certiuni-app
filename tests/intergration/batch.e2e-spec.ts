import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as argon2 from 'argon2';
import * as XLSX from 'xlsx';

describe('Batch Processing (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let adminToken: string;
    let universityId: string;

    const adminUser = {
        email: 'batch.admin@certiuni.cm',
        password: 'Password2026!',
        firstName: 'Batch',
        lastName: 'Admin',
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
        await prisma.university.deleteMany({ where: { code: 'UNI-BATCH-TEST' } });

        // Création d'une université de test
        const university = await prisma.university.create({
            data: {
                name: 'Université de Test Batch',
                code: 'UNI-BATCH-TEST',
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

        // Authentification pour récupérer le jeton JWT
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

    describe('POST /certificates/batch-import', () => {
        it('devrait rejeter la requête sans fichier joint (400 Bad Request)', async () => {
            await request(app.getHttpServer())
                .post('/certificates/batch-import')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);
        });

        it('devrait rejeter un format de fichier non supporté (ex: .txt)', async () => {
            const textBuffer = Buffer.from('studentFirstName,studentLastName\nJohn,Doe');

            await request(app.getHttpServer())
                .post('/certificates/batch-import')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file', textBuffer, 'invalid.txt')
                .expect(400);
        });

        it('devrait importer avec succès une liste d\'étudiants à partir d\'un fichier CSV', async () => {
            const csvContent = [
                'studentFirstName,studentLastName,studentBirthDate,studentIdNumber,degreeTitle,speciality',
                'Paul,Atreides,2001-05-15,MAT-2026-001,Master en Intelligence Artificielle,Génie Logiciel',
                'Chani,Kynes,2002-08-20,MAT-2026-002,Master en Intelligence Artificielle,Data Science',
            ].join('\n');

            const csvBuffer = Buffer.from(csvContent, 'utf-8');

            const response = await request(app.getHttpServer())
                .post('/certificates/batch-import')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file', csvBuffer, 'import.csv')
                .expect(201);

            expect(response.body).toMatchObject({
                totalProcessed: 2,
                successCount: 2,
                errorCount: 0,
            });

            // Vérification en base de données
            const importedCertificates = await prisma.certificate.findMany({
                where: { universityId },
            });
            expect(importedCertificates).toHaveLength(2);
        });

        it('devrait importer avec succès une liste d\'étudiants à partir d\'un fichier Excel (.xlsx)', async () => {
            const worksheetData = [
                ['studentFirstName', 'studentLastName', 'studentBirthDate', 'studentIdNumber', 'degreeTitle', 'speciality'],
                ['Jean', 'Dupont', '2000-01-10', 'MAT-2026-003', 'Licence en Informatique', 'Réseaux'],
                ['Marie', 'Curie', '1999-11-07', 'MAT-2026-004', 'Doctorat en Physique', 'Physique Nucléaire'],
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Etudiants');
            const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            const response = await request(app.getHttpServer())
                .post('/certificates/batch-import')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file', excelBuffer, 'import.xlsx')
                .expect(201);

            expect(response.body).toMatchObject({
                totalProcessed: 2,
                successCount: 2,
                errorCount: 0,
            });
        });

        it('devrait retourner des erreurs partielles si certaines lignes du fichier sont invalides', async () => {
            const invalidCsvContent = [
                'studentFirstName,studentLastName,studentBirthDate,studentIdNumber,degreeTitle,speciality',
                'Valid,Student,2001-03-30,MAT-2026-005,Licence Droit,Droit Privé',
                ',MissingLastName,2001-03-30,MAT-2026-006,Licence Droit,Droit Privé', // Prenom manquant
            ].join('\n');

            const csvBuffer = Buffer.from(invalidCsvContent, 'utf-8');

            const response = await request(app.getHttpServer())
                .post('/certificates/batch-import')
                .set('Authorization', `Bearer ${adminToken}`)
                .attach('file', csvBuffer, 'invalid_rows.csv')
                .expect(201);

            expect(response.body).toMatchObject({
                totalProcessed: 2,
                successCount: 1,
                errorCount: 1,
            });

            expect(response.body.errors).toHaveLength(1);
            expect(response.body.errors[0]).toHaveProperty('rowNumber', 3);
        });
    });
});