import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from './refresh-token.service';
import { randomUUID } from 'crypto';

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class AuthService {
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService?: RefreshTokenService
  ) {
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // constructor injected above handles initialization

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateTokens(payload: Record<string, any>): Promise<Tokens> {
    const accessToken = this.jwtService.sign(payload);

    // generate a jti for the refresh token and include it as a claim
    const jti = randomUUID();
    const refreshPayload = { ...payload, jti };
    const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: this.refreshExpiresIn });

    if (this.refreshTokenService) {
      // compute expiresAt from refreshExpiresIn and store only the jti in the database (more robust than storing full token)
      const expiresAt = this.computeExpiresAt(this.refreshExpiresIn);
      await this.refreshTokenService.create({ userId: payload.sub, token: jti, expiresAt });
    }

    return { accessToken, refreshToken };
  }

  verifyToken<T = any>(token: string): T | null {
    try {
      return this.jwtService.verify(token) as T;
    } catch (err) {
      return null;
    }
  }

  verifyRefreshToken(token: string) {
    const payload = this.verifyToken(token);
    if (!payload) return null;

    if (!this.refreshTokenService) return payload;

    const rts = this.refreshTokenService;
    return (async () => {
      const jti = (payload as any).jti;
      if (!jti) return null;
      const stored = await rts.findByToken(jti);
      if (!stored) return null;
      if (stored.revoked) return null;
      if (stored.expiresAt && new Date(stored.expiresAt) < new Date()) return null;
      return payload;
    })();
  }

  async revokeRefreshToken(token: string) {
    if (!this.refreshTokenService) return;
    // extract jti from token and revoke by jti
    const payload = this.verifyToken(token) as any;
    const jti = payload?.jti;
    if (!jti) return;
    await this.refreshTokenService.revokeByToken(jti);
  }

  async rotateRefreshToken(oldToken: string, payload: Record<string, any>) {
    // Revoke old token (by jti) and issue/store a new one
    if (this.refreshTokenService) {
      const oldPayload = this.verifyToken(oldToken) as any;
      const oldJti = oldPayload?.jti;
      if (oldJti) {
        await this.refreshTokenService.revokeByToken(oldJti);
      }
    }
    return this.generateTokens(payload);
  }

  // Parse duration strings like '7d', '1h', '30m', '3600' (seconds) and return a Date or null
  private computeExpiresAt(duration: string): Date | null {
    if (!duration) return null;
    // numeric seconds
    if (/^\d+$/.test(duration)) {
      const secs = parseInt(duration, 10);
      return new Date(Date.now() + secs * 1000);
    }

    const m = duration.match(/^(\d+)([smhd])$/);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    const unit = m[2];
    let ms = 0;
    switch (unit) {
      case 's':
        ms = n * 1000;
        break;
      case 'm':
        ms = n * 60 * 1000;
        break;
      case 'h':
        ms = n * 60 * 60 * 1000;
        break;
      case 'd':
        ms = n * 24 * 60 * 60 * 1000;
        break;
      default:
        return null;
    }
    return new Date(Date.now() + ms);
  }
}
