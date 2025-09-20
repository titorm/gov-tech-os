import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthController (unit)', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const authMock: Partial<AuthService> = {
      verifyRefreshToken: jest.fn().mockResolvedValue({ sub: 'user-1', role: 'user' }),
      rotateRefreshToken: jest.fn().mockResolvedValue({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
      revokeRefreshToken: jest.fn().mockResolvedValue(undefined),
      generateTokens: jest.fn().mockResolvedValue({ accessToken: 'a', refreshToken: 'r' }),
    };

    const usersMock: Partial<UsersService> = {
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: UsersService, useValue: usersMock },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  it('refresh should rotate tokens and return access token', async () => {
    // Simulate request/response objects minimally
    const req: any = { body: { refreshToken: 'old-refresh' }, cookies: {} };
    const res: any = { cookie: jest.fn() };

    const result = await controller.refresh(req, res);
    expect(result.ok).toBe(true);
    expect(result.accessToken).toBe('new-access');
    expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'new-refresh', expect.any(Object));
  });

  it('logout should revoke token and clear cookie', async () => {
    const req: any = { body: { refreshToken: 'old-refresh' }, cookies: {} };
    const res: any = { clearCookie: jest.fn() };

    const result = await controller.logout(req, res);
    expect(result.ok).toBe(true);
    expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
  });
});
