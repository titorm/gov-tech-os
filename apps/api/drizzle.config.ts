import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/postgres/schemas/*',
  out: './src/database/postgres/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;