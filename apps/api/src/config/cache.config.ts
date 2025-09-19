import { registerAs } from '@nestjs/config';

export const cacheConfig = registerAs('cache', () => ({
  ttl: parseInt(process.env.CACHE_TTL || '300'), // 5 minutes default
  max: 1000, // maximum number of items in cache
  refreshThreshold: 0.8, // refresh when 80% of TTL is reached
}));