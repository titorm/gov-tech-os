import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';

// Configuration loaders (project config functions)
import { databaseConfig } from './config/database.config';
import { jwtConfig } from './config/jwt.config';
import { cacheConfig } from './config/cache.config';

// Feature modules (import existing modules)
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { LogsModule } from './modules/logs/logs.module';

// Websocket and common providers
import { AppGateway } from './websocket/gateways/app.gateway';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Health module is loaded via require to avoid potential circular dependency during early bootstrap
const HealthModule = require('./health/health.module').HealthModule;

// Build imports list and conditionally include optional connections
const importsList: any[] = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [databaseConfig, jwtConfig, cacheConfig],
    envFilePath: ['.env.local', '.env'],
  }),
  ThrottlerModule.forRoot({
    ttl: parseInt(process.env.THROTTLE_TTL || '60'),
    limit: parseInt(process.env.THROTTLE_LIMIT || '20'),
  } as unknown as any),
  CacheModule.register({ isGlobal: true }),
  AuthModule,
  UsersModule,
  SubscriptionsModule,
  LogsModule,
  HealthModule,
];

if (process.env.MONGODB_URI) {
  importsList.unshift(MongooseModule.forRoot(process.env.MONGODB_URI, { connectionName: 'logs' }));
}

@Module({
  imports: importsList,
  providers: [
    AppGateway,
    { provide: 'APP_FILTER', useClass: AllExceptionsFilter },
    { provide: 'APP_INTERCEPTOR', useClass: LoggingInterceptor },
    { provide: 'APP_INTERCEPTOR', useClass: TransformInterceptor },
  ],
})
export class AppModule {}
