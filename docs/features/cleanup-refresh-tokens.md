# Cleanup Refresh Tokens

## Overview

A scheduled job to remove expired refresh tokens from the `refresh_tokens` table. This helps keep the database small and
avoid accumulating stale rows.

## Core Functionality

- Script: `scripts/cleanup_refresh_tokens.js`
- NPM script: `cleanup:refresh-tokens` (root `package.json`) — runs the cleanup script
- GitHub Actions workflow: `.github/workflows/cleanup_refresh_tokens.yml` — scheduled daily at 03:00 UTC and supports
  manual `workflow_dispatch`.

## Technical Implementation

- The script connects to PostgreSQL using `DATABASE_URL` either from the environment or as a CLI argument.
- It runs the SQL:

```sql
DELETE FROM refresh_tokens WHERE expires_at IS NOT NULL AND expires_at < now();
```

The script now supports safer, batched deletes (see CLI options below).

- On the workflow it runs `pnpm install` then `pnpm run cleanup:refresh-tokens`.

## Dependencies

- `pg` (used by the Node script)
- `pnpm` for workspace installs in CI

## Testing Strategy

- Locally: point the script at a dev/staging database and run:

```bash
DATABASE_URL=postgres://user:pass@host:5432/db node scripts/cleanup_refresh_tokens.js
# or
node scripts/cleanup_refresh_tokens.js postgres://user:pass@host:5432/db
```

### New CLI options

- `--dry-run` or `--dry`: report how many rows would be deleted and show a small sample (no deletes performed)
- `--batch-size <n>`: number of rows to delete per transaction (default: `1000`)
- `--limit <n>`: optional total cap on number of rows to delete in this run

Examples:

Dry-run with defaults:

```bash
pnpm run cleanup:refresh-tokens -- --dry-run
```

Perform batched cleanup deleting at most 5000 rows in batches of 500:

```bash
DATABASE_URL=postgres://user:pass@host:5432/db pnpm run cleanup:refresh-tokens -- --batch-size 500 --limit 5000
```

- In CI: workflow runs daily on the schedule; you can trigger it manually via Actions UI.

## Future Considerations

- Make deletion conditional on environment (e.g., only run against production DB if explicitly allowed).
- Emit metrics or post a Slack message with the number of deleted rows.
- Add dry-run mode to print rows that would be deleted without deleting them.
- Convert script to TypeScript and move into `apps/api` with a proper database client wrapper.
