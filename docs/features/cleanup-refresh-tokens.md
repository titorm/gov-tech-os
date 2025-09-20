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

## Status — O que já foi implementado

Abaixo está o resumo das mudanças que já foram aplicadas e validadas no repositório:

- Script `scripts/cleanup_refresh_tokens.js`:
  - Suporta `--dry` / `--dry-run` (modo somente leitura) — imprime contagem e amostra de linhas, sem apagar.
  - Suporta `--batch-size <n>` (padrão `1000`) para deletar em lotes e evitar locks longos.
  - Suporta `--limit <n>` para limitar o número total de linhas removidas nesta execução.
  - Implementa exclusões em lotes usando `DELETE ... WHERE id IN (SELECT id ... LIMIT $1) RETURNING id` em loop.
  - Falha cedo com código de saída `2` se `DATABASE_URL` não for fornecido (posicional ou via env). `pg` é importado
    apenas após a verificação para permitir fail-fast local.

- Workflow GitHub Actions (`.github/workflows/cleanup_refresh_tokens.yml`):
  - Job `dry_run`: agendado diariamente (03:00 UTC) — executa o script em `--dry-run` para verificação automática.
  - Job `perform_cleanup`: job protegido (anexado ao `environment: production`) para execução destrutiva.
  - `perform_cleanup` pode ser acionado de duas formas seguras:
    - Manual: `workflow_dispatch` com `perform_cleanup=true` (mantido).
    - Automática: `push` para o branch `main` quando a mensagem do commit contém `[perform-cleanup]` — ainda exige
      aprovação do ambiente.
  - O workflow exporta `secrets.DATABASE_URL` para `GITHUB_ENV` numa etapa inicial e falha cedo se a secret estiver
    ausente.

- Scripts NPM:
  - `cleanup:refresh-tokens` adicionado no `package.json` raiz para rodar o script via
    `pnpm run cleanup:refresh-tokens`.

- Documentação:
  - Esta página foi atualizada para documentar os novos flags (`--batch-size`, `--limit`) e exemplos de uso.

Observações operacionais:

- A proteção via `environment: production` ainda exige aprovação manual nos runners do GitHub Actions — isto é
  intencional para evitar exclusões acidentais.
- Para execução automática sem aprovação, seria necessário remover/alterar a proteção do ambiente (não recomendado para
  produção).

- In CI: workflow runs daily on the schedule; you can trigger it manually via Actions UI.

## Future Considerations

- Make deletion conditional on environment (e.g., only run against production DB if explicitly allowed).
- Emit metrics or post a Slack message with the number of deleted rows.
- Add dry-run mode to print rows that would be deleted without deleting them.
- Convert script to TypeScript and move into `apps/api` with a proper database client wrapper.

---

## Status (English summary)

Summary of implemented changes:

- Script `scripts/cleanup_refresh_tokens.js`:
  - Supports `--dry` / `--dry-run` (read-only mode) — prints counts and sample rows without deleting.
  - Supports `--batch-size <n>` (default `1000`) to delete in batches and avoid long locks.
  - Supports `--limit <n>` to cap total rows deleted in a run.
  - Performs batched deletes using `DELETE ... WHERE id IN (SELECT id ... LIMIT $1) RETURNING id` in a loop.
  - Fails fast with exit code `2` if `DATABASE_URL` is not provided (positional arg or env). `pg` is imported only after
    the check so local runs can fail-fast without `pg` installed.

- GitHub Actions workflow (`.github/workflows/cleanup_refresh_tokens.yml`):
  - `dry_run` job: scheduled daily (03:00 UTC) — runs script with `--dry-run` for automatic verification.
  - `perform_cleanup` job: protected by `environment: production` for destructive runs.
  - `perform_cleanup` can be triggered either manually (`workflow_dispatch` with `perform_cleanup=true`) or
    automatically on `push` to `main` when the commit message includes `[perform-cleanup]` — environment approval still
    required.
  - The workflow exports `secrets.DATABASE_URL` into `GITHUB_ENV` in an early step and fails fast if the secret is
    missing.

- NPM scripts:
  - `cleanup:refresh-tokens` exists in the root `package.json` to run the script: `pnpm run cleanup:refresh-tokens`.

Operational notes:

- The `environment: production` protection requires approval for the perform job — this is intentional to prevent
  accidents.
- To enable fully automatic deletion you would remove environment protections (not recommended for production
  databases).
