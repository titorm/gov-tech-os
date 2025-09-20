# Run local development (short guide)

This guide explains how to start the monorepo for local development while avoiding starting the mobile workspace and how
to resolve common port conflicts.

Start only the API (recommended during backend work):

```bash
pnpm -w -F api run dev
```

Start only the web app (frontend):

```bash
pnpm -w -F web run dev
```

Start both API and web together (exclude mobile):

```bash
pnpm dev
```

If you encounter `EADDRINUSE` (address in use) on macOS for port `3001` (API):

1. Find the process using the port:

```bash
lsof -i :3001 -n -P
```

2. Kill the process by PID (replace `<PID>`):

```bash
kill -9 <PID>
```

Or kill in one command:

```bash
kill $(lsof -t -i:3001)
```

Environment variables

- `MONGODB_URI` — optional for local dev; if not provided the API will skip connecting to Mongo.
- `JWT_SECRET` — set this in CI/prod; default `dev-secret` is used in local dev.

If you want, I can add this short guide to the repository README as well.
