/**
 * Intégration tests Super Admin (ADM) - Validation rapide
 */

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { AppModule } from '../src/app.module';

describe('ADM Integration Smoketest', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Clean DB entre tests
  });

  afterAll(async () => {
    await app.close();
  });

  it('ADM: Endpoints Super Admin respondent', async () => {
    const resp = await request(app.getHttpServer())
      .get('/admin/institutions')
      .expect(200);
    expect(resp.body).toBeDefined();
  });

  it('ADM: Endpoints security config respondent', async () => {
    const resp = await request(app.getHttpServer())
      .get('/admin/security/services-status')
      .expect(200);
    expect(resp.body).toBeDefined();
  });

  it('ADM: Endpoints reporting respondent', async () => {
    const resp = await request(app.getHttpServer())
      .post('/admin/reports/generate')
      .send({ period: 'MONTH' })
      .expect(200);
    expect(resp.body).toBeDefined();
  });

  it('ADM: Endpoints document governance respondent', async () => {
    const resp = await request(app.getHttpServer())
      .get('/admin/documents/statistics')
      .expect(200);
    expect(resp.body).toBeDefined();
  });
});