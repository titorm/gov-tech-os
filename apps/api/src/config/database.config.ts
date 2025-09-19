import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  postgres: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    url: process.env.REDIS_URL,
  },
}));