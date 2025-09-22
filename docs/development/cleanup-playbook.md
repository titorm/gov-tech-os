# Playbook: Cleanup expired refresh tokens (Operações)

Este playbook descreve os passos operacionais para testar, executar e validar o script de limpeza de `refresh_tokens`.

## Objetivos

- Executar uma verificação diária (dry-run) automática.
- Permitir execução de limpeza real com aprovação manual.
- Evitar bloqueios longos no banco por meio de deleções em lotes.

## Arquivos relevantes

- `scripts/cleanup_refresh_tokens.js`
- `.github/workflows/cleanup_refresh_tokens.yml`
- `docs/features/cleanup-refresh-tokens.md`

## Procedimentos

### 1) Dry-run local

```bash
pnpm run cleanup:refresh-tokens -- --dry-run
# ou
node scripts/cleanup_refresh_tokens.js --dry-run
```

### 2) Dry-run contra DB de dev/staging

```bash
DATABASE_URL=postgres://user:pass@host:5432/db pnpm run cleanup:refresh-tokens -- --dry-run
```

### 3) Executar limpeza em lotes localmente

```bash
DATABASE_URL=postgres://user:pass@host:5432/db pnpm run cleanup:refresh-tokens -- --batch-size 500 --limit 5000
```

You can add a short pause between batches to reduce DB pressure:

```bash
DATABASE_URL=postgres://user:pass@host:5432/db pnpm run cleanup:refresh-tokens -- --batch-size 500 --limit 5000 --pause-ms 200
```

### 4) Executar via GitHub Actions (recomendado)

1. Vá em Actions → `Cleanup expired refresh tokens` → `Run workflow`.
2. Marque `perform_cleanup=true` e execute.
3. Aprove o job no `environment: production` quando aparecer a solicitação de aprovação.

### 5) Executar automática através de commit (opcional)

- Realize um push para `main` com mensagem de commit contendo `[perform-cleanup]`. O job `perform_cleanup` será
  disparado, mas ainda ficará aguardando aprovação do `environment`.

## Observações de rollback

- Tenha backups/point-in-time restore configurados para o banco de dados.
- Em caso de exclusão acidental, restaure via backups.

## English quick reference

- Dry-run:

```bash
pnpm run cleanup:refresh-tokens -- --dry-run
```

- Perform batched cleanup (example):

```bash
DATABASE_URL=postgres://user:pass@host:5432/db pnpm run cleanup:refresh-tokens -- --batch-size 500 --limit 5000
```
