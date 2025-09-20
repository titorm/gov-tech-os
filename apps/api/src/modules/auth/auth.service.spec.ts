import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';

    // Minimal JwtService mock
    const jwtMock: any = {
      sign(payload: any, options?: any) {
        // simple base64-encoded payload imitation for tests
        return Buffer.from(JSON.stringify({ ...payload, iat: Date.now() / 1000 })).toString('base64');
      },
      verify(token: string) {
        try {
          const str = Buffer.from(token, 'base64').toString('utf8');
          return JSON.parse(str);
        } catch (err) {
          throw new Error('invalid token');
        }
      },
    };

    service = new AuthService(jwtMock);
  });

  it('hashes and compares password correctly', async () => {
    const plain = 'S3cureP@ssw0rd';
    const hash = await service.hashPassword(plain);
    expect(hash).toBeDefined();
    const isMatch = await service.comparePassword(plain, hash);
    expect(isMatch).toBe(true);
    const isFalse = await service.comparePassword('wrong', hash);
    expect(isFalse).toBe(false);
  });

  it('generates and verifies JWT tokens', async () => {
    const payload = { sub: 'user:1', role: 'admin' };
    const tokens = await service.generateTokens(payload);
    expect(tokens.accessToken).toBeDefined();
    const decoded = service.verifyToken(tokens.accessToken as string) as any;
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.role).toBe(payload.role);
  });

  it('returns null for invalid token', () => {
    const decoded = service.verifyToken('not-a-token');
    expect(decoded).toBeNull();
  });
});
