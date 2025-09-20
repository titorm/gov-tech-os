import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const usersToMunicipios = pgTable('users_to_municipios', {
  userId: uuid('user_id').notNull(),
  municipioId: varchar('municipio_id', { length: 36 }).notNull(),
});

export type UserToMunicipio = typeof usersToMunicipios.$inferSelect;
