import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET || 'dev-secret',
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
      }),
    }),
  ],
  providers: [AuthService, RefreshTokenService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
