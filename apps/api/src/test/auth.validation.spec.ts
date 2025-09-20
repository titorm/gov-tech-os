import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { LoginDto } from '../modules/auth/dto/login.dto';

describe('Login Validation (unit)', () => {
  it('formats validation errors as documented', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: errors => {
        const formatted = (errors as any[]).map(err => ({
          field: err.property,
          constraints: err.constraints || {},
        }));

        const response = {
          statusCode: 400,
          ok: false,
          message: 'Validation failed',
          errors: formatted,
        };

        return new BadRequestException(response);
      },
    });

    const invalid = { email: 'not-an-email', password: '1' };

    try {
      await pipe.transform(invalid, { type: 'body', metatype: LoginDto });
      throw new Error('Validation should have failed');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      const resp = (err as BadRequestException).getResponse() as any;
      expect(resp.ok).toBe(false);
      expect(resp.statusCode).toBe(400);
      expect(resp.message).toBe('Validation failed');
      expect(Array.isArray(resp.errors)).toBe(true);
      const fields = resp.errors.map((e: any) => e.field).sort();
      expect(fields).toEqual(['email', 'password']);
    }
  });
});
