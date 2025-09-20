import { AuthService } from './auth.service';

describe('AuthService - refresh token verification', () => {
  const payloadBase = { sub: 'user-1', role: 'user' };
  const token = 'valid-token';
  const jti = 'jti-123';

  it('returns payload when token is valid and stored', async () => {
    const payload = { ...payloadBase, jti };
    const jwtMock: any = {
      sign: () => token,
      verify: (t: string) =>
        t === token
          ? payload
          : (() => {
              throw new Error('invalid');
            })(),
    };

    const rtsMock: any = {
      findByToken: async (t: string) => (t === jti ? { token: t, revoked: false, expiresAt: null } : undefined),
    };

    const svc = new AuthService(jwtMock, rtsMock);
    const res = (await svc.verifyRefreshToken(token)) as any;
    expect(res).toBeDefined();
    expect((res as any).sub).toBe(payload.sub);
  });

  it('returns null when token is revoked', async () => {
    const payload = { ...payloadBase, jti };
    const jwtMock: any = {
      sign: () => token,
      verify: (t: string) =>
        t === token
          ? payload
          : (() => {
              throw new Error('invalid');
            })(),
    };

    const rtsMock: any = {
      findByToken: async (t: string) => (t === jti ? { token: t, revoked: true, expiresAt: null } : undefined),
    };

    const svc = new AuthService(jwtMock, rtsMock);
    const res = (await svc.verifyRefreshToken(token)) as any;
    expect(res).toBeNull();
  });
});
