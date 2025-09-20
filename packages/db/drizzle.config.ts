import type { Config } from 'drizzle-kit';
import { env } from 'node:process';

const config = {
  schema: ['./src/schemas/*.ts'],
  out: './drizzle',
  breakpoints: false,
  driver: 'pg',
} as Config;

export default config;
