# @gov-tech/db

This package contains Drizzle ORM schema definitions for the monorepo.

Quick start

1. Install dependencies (from repo root):

```bash
pnpm install
pnpm -w -F @gov-tech/db install
```

2. Generate migrations (drizzle-kit):

```bash
pnpm -w -F @gov-tech/db db:generate
```

3. Push migrations to the database (be careful — this applies schema changes):

```bash
pnpm -w -F @gov-tech/db db:push
```

Schemas are under `src/schemas` and the migration templates are in `migrations/`.
