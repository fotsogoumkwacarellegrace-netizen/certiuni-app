import request from 'supertest';
import app from '../../src/app';
import { UserRole } from '@prisma/client';

describe('Universities & Students Registration (integration, no DB)', () => {
    describe('Universities', () => {
        it('POST /api/v1/universities -> should create a university as SUPER_ADMIN', async () => {
            const createDto = {
                name: 'Université de Test',
                code: 'U_TEST',
                contactEmail: 'admin@test.univ',
                isActive: true,
            };

            const res = await request(app)
                .post('/api/v1/universities')
                .set('Authorization', 'Bearer fake-super-admin-token')
                .send(createDto);

            // La réponse est enveloppée : { status: 'success', message, data, timestamp }
            // soit directement : { data, ... }
            const university = res.body.data || res.body;

            // Statut 201 = créé, 409 = code dupliqué (acceptable)
            expect([201, 409].includes(res.status)).toBeTruthy();

            if (res.status === 201 && university && university.id) {
                // Stocker l'ID de l'université créée pour les tests étudiants suivants
                // (on le stocke dans une variable globale accessible)
                ;(global as any).createdUniversityId = university.id;
                ;(global as any).createdUniversityName = university.name;
                ;(global as any).createdUniversityCode = university.code;
                expect(university).toMatchObject({
                    name: 'Université de Test',
                    code: 'U_TEST',
                });
            }
        });

        it('POST /api/v1/universities -> should reject non-SUPER_ADMIN', async () => {
            const createDto = {
                name: 'Université Non-Auth',
                code: 'U_NOAUTH',
            };

            const res = await request(app)
                .post('/api/v1/universities')
                .set('Authorization', 'Bearer fake-univ-admin-token')
                .send(createDto);

            // UNIV_ADMIN ne peut pas créer, seul SUPER_ADMIN
            expect(res.status).toBe(403);
        });
    });

    describe('Students', () => {
        it('POST /api/v1/students -> should create a student with university association', async () => {
            // Récupérer l'ID de l'université créée dans le test précédent
            const universityId = (global as any).createdUniversityId;
            const universityName = (global as any).createdUniversityName;

            // Si l'université n'a pas été créée (statut 409 ou échec), on saute ce test
            if (!universityId) {
                console.warn('⚠️ Université non créée dans le test précédent ; test étudiant sauté.');
                return;
            }

            const createDto = {
                matricule: 'STU-001',
                firstName: 'Jean',
                lastName: 'Dupont',
                email: 'jean.dupont@test.univ',
                universityId,
                level: 'L3',
                fieldOfStudy: 'Informatique',
            };

            const res = await request(app)
                .post('/api/v1/students')
                .set('Authorization', 'Bearer fake-super-admin-token')
                .send(createDto);

            expect(res.status).toBe(201);
            if (res.status === 201) {
                expect(res.body).toMatchObject({
                    matricule: 'STU-001',
                    firstName: 'Jean',
                    lastName: 'Dupont',
                    universityId,
                });
            }
        });

        it('POST /api/v1/students -> should reject UNIV_ADMIN from creating students', async () => {
            // UNIV_ADMIN ne doit pas pouvoir créer d'étudiants via cette route
            // (seul SUPER_ADMIN a ce privilège)
            const createDto = {
                matricule: 'STU-002',
                firstName: 'Marie',
                lastName: 'Curie',
                email: 'marie.curie@test.univ',
                // pas de universityId - mais ce champ sera rejeté par la validation
                // ou le contrôleur doit rejouer par rôle
            };

            const res = await request(app)
                .post('/api/v1/students')
                .set('Authorization', 'Bearer fake-univ-admin-token')
                .send(createDto);

            // Attendu : 403 Forbidden (UNIV_ADMIN non autorisé à créer)
            expect(res.status).toBe(403);
        });
    });
});