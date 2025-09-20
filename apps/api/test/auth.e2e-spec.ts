import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/modules/users/users.service';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let usersService: Partial<UsersService>;

  beforeAll(async () => {
    usersService = {
      async findByEmail(email: string) {
        // Will be set later
        return undefined;
      },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - success', async () => {
    const auth = new AuthService();
    const plain = 'TestPass123';
    const hash = await auth.hashPassword(plain);
    // override findByEmail to return a user with this hash
    (usersService as any).findByEmail = async () => ({
      id: 'user-1',
      email: 'test@example.com',
      password: hash,
      role: 'user',
    });

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: plain })
      .expect(200);

    expect(res.body.ok).toBe(true);
    expect(res.body.tokens?.accessToken).toBeDefined();
  });
});
