import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth Validation (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - validation error', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'not-an-email', password: '1' })
      .expect(400);

    expect(res.body.ok).toBe(false);
    expect(res.body.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.errors)).toBe(true);
    // errors should contain an entry for email and password
    const fields = res.body.errors.map((e: any) => e.field).sort();
    expect(fields).toEqual(['email', 'password']);
  });
});
