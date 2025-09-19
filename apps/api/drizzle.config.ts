import type { Config } from 'drizzle-kit';

// Use a loose cast to avoid mismatches between local drizzle-kit types and the installed version.
export default {
  schema: './src/database/postgres/schemas/*',
  out: './src/database/postgres/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} as unknown as Config;
