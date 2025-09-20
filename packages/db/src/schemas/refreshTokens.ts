import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  token: varchar('token', { length: 512 }).notNull(),
  revoked: boolean('revoked').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
});

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
