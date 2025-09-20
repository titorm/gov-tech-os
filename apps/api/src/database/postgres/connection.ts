import type { AnyPgTable } from 'drizzle-orm/pg-core';

let db: any;

if (process.env.DATABASE_URL) {
  // Only load heavy DB libs when DATABASE_URL is provided (real runtime)
  const { drizzle } = require('drizzle-orm/postgres-js');
  const postgres = require('postgres');
  const schema = require('./schemas');

  const connectionString = process.env.DATABASE_URL;
  const client = postgres(connectionString, { prepare: false });
  db = drizzle(client, { schema });
} else {
  // In test/local dev without DB, export a minimal stub with the methods used by services.
  const noop = () => ({ returning: async () => [], values: () => ({ returning: async () => [] }) });
  db = {
    select: () => ({ from: () => ({ where: () => Promise.resolve([]), limit: () => Promise.resolve([]) }) }),
    insert: () => ({ values: noop, returning: async () => [] }),
    update: () => ({ set: () => ({ where: () => ({ returning: async () => [] }) }) }),
    delete: () => ({ where: () => ({}) }),
  } as any;
}

export { db };
