import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const municipios = pgTable('municipios', {
  id: varchar('id', { length: 36 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
});

export type Municipio = typeof municipios.$inferSelect;
