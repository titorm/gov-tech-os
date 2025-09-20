# API (NestJS) — Development README

This service is a NestJS application using the Fastify adapter. It provides the backend API for the GovTech OS monorepo.

Quick start (local)

1. Install dependencies at repo root:

```bash
pnpm install
```

2. Run API in dev mode (watch):

```bash
pnpm --filter api dev
```

3. Build for production:

```bash
pnpm --filter api build
pnpm --filter api start:prod
```

Scripts

- `pnpm --filter api dev` — start in watch mode (Nest CLI)
- `pnpm --filter api build` — compile TypeScript
- `pnpm --filter api test` — run unit tests
- `pnpm --filter api lint` — run eslint

Environment variables

The app reads configuration via `@nestjs/config`. Common variables used in the project (do not commit secrets):

- `PORT` — port the app listens on (default: `3001`)
- `NODE_ENV` — `development|staging|production`
- `MONGODB_URI` — MongoDB connection string used by the logs connection
- `DATABASE_URL` — Postgres connection string used by Drizzle (pg)
- `REDIS_HOST` / `REDIS_PORT` — Redis connection for cache
- `JWT_SECRET` — secret for signing JWTs

Database / Migrations

- Uses `drizzle-kit` for Drizzle migrations. See `package.json` scripts:
  - `pnpm --filter api run db:generate`
  - `pnpm --filter api run db:push`

Testing

- Unit tests: `pnpm --filter api test`
- E2E tests: `pnpm --filter api test:e2e` (requires additional test configuration)

Notes

- Health endpoint: `GET /health` returns `{ status: 'ok' }`.
- The app registers global pipes and basic security headers in `main.ts`.
