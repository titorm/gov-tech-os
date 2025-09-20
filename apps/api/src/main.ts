import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    })
  );

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Security
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        scriptSrc: [`'self'`],
        objectSrc: [`'none'`],
        upgradeInsecureRequests: [],
      },
    },
  });

  // CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: errors => {
        // Map ValidationError[] to a consistent error shape
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
    })
  );

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 API running on: http://localhost:${port}/${globalPrefix}`, 'Bootstrap');
}

bootstrap().catch(err => {
  Logger.error('❌ Error starting server', err, 'Bootstrap');
  process.exit(1);
});
