import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      return { ok: false, message: 'Invalid credentials' };
    }

    const match = await this.authService.comparePassword(body.password, user.password);
    if (!match) return { ok: false, message: 'Invalid credentials' };

    const tokens = await this.authService.generateTokens({ sub: user.id, role: user.role });

    if (tokens.refreshToken) {
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return { ok: true, tokens: { accessToken: tokens.accessToken } };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const incoming = (req as any).cookies?.refresh_token || req.body?.refreshToken;
    if (!incoming) return { ok: false, message: 'No refresh token provided' };
    const payload = await this.authService.verifyRefreshToken(incoming as string);
    if (!payload) return { ok: false, message: 'Invalid refresh token' };

    // Rotate refresh token: revoke the old one and issue a new pair
    const tokens = await this.authService.rotateRefreshToken(incoming as string, payload as Record<string, any>);
    if (tokens.refreshToken) {
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    }
    return { ok: true, accessToken: tokens.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const incoming = (req as any).cookies?.refresh_token || req.body?.refreshToken;
    if (!incoming) return { ok: true };

    await this.authService.revokeRefreshToken(incoming as string);
    // Clear cookie
    res.clearCookie('refresh_token');
    return { ok: true };
  }
}
