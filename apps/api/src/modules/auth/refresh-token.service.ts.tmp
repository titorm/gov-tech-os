import { Injectable } from '@nestjs/common';
import { db } from '../../database/postgres/connection';
import { refreshTokens } from '@gov-tech/db';
import { eq } from 'drizzle-orm';
import type { NewRefreshToken, RefreshToken } from '@gov-tech/db';

@Injectable()
export class RefreshTokenService {
  async create(token: NewRefreshToken): Promise<RefreshToken> {
    // compute expiresAt if not provided (supports '7d','1h','30m' or seconds)
    if (!token.expiresAt) {
      const raw = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
      const expiresAt = this.computeExpiresAt(raw);
      if (expiresAt) token.expiresAt = expiresAt as any;
    }

    const [created] = await db.insert(refreshTokens).values(token).returning();
    return created as unknown as RefreshToken;
  }

  async revokeByToken(tokenStr: string) {
    await db.update(refreshTokens).set({ revoked: true }).where(eq(refreshTokens.token, tokenStr));
  }

  async findByToken(tokenStr: string): Promise<RefreshToken | undefined> {
    const res = await db.select().from(refreshTokens).where(eq(refreshTokens.token, tokenStr)).limit(1);
    return res[0] as unknown as RefreshToken | undefined;
  }

  private computeExpiresAt(duration?: string): Date | null {
    if (!duration) return null;
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
