import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Application des mêmes pipelines globaux qu'en prod
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/api/v1/health (GET) - doit retourner le statut de l\'application', () => {
        return request(app.getHttpServer())
            .get('/api/v1/health')
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('status', 'ok');
            });
    });
});