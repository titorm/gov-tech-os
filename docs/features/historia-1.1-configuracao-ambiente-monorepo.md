# História 1.1 — Configuração do Ambiente de Desenvolvimento (Monorepo)

## Visão Geral

Esta documentação cobre a implementação da **História 1.1: Configuração do Ambiente de Desenvolvimento (Monorepo)**
descrita no backlog (`docs/development/tasks.md`). O objetivo é garantir que o monorepo esteja corretamente inicializado
com `pnpm`, que as configurações compartilhadas (ESLint, TypeScript, Turborepo) estejam posicionadas em `packages/`, e
que o ambiente de desenvolvimento seja reproduzível e fácil para novos engenheiros.

Esta documentação deve ser a referência primária antes de qualquer modificação de código relacionada a esta história,
conforme a política do projeto.

## Core Functionality

- Inicializar/validar a configuração `pnpm` na raiz do repositório.
- Garantir que `pnpm-workspace.yaml` inclua todos os workspaces relevantes (`apps/*`, `packages/*`).
- Adicionar/validar `turbo.json` com pipelines básicos (`dev`, `build`, `lint`).
- Criar pacotes iniciais de configuração em `packages/` (ESLint e TypeScript) com documentação mínima de uso.
- Documentar os comandos principais para novos desenvolvedores e como usar `doppler` para gerenciamento de segredos
  localmente (documentação e `.env.example`).

## Itens incluídos (Tarefas derivadas)

- T-101: Inicializar Repositório e Estrutura `pnpm`
- T-102: Configurar Pipeline Básico do Turborepo
- T-103: Criar Pacote de Configuração ESLint
- T-104: Criar Pacote de Configuração TypeScript
- T-105: Configurar Gerenciamento de Segredos com Doppler

## Technical Implementation

Arquitetura e locais de arquivos previstos:

- `pnpm-workspace.yaml` — arquivo raiz que define os workspaces (já existente; validar).
- `turbo.json` — arquivo raiz com pipelines do Turborepo. Se ausente, criar com pipelines mínimos.
- `packages/eslint/` — package contendo a configuração compartilhada do ESLint/Prettier.
- `packages/tsconfig/` — package contendo `tsconfig.base.json` e presets para apps.
- `docs/development/` — atualizar `.md` de tasks (já existe) e referenciar esta documentação.

Passos concretos (mínimo viável, sem risco):

1. Documentar a intenção e os critérios de aceitação (feito aqui).
2. Validar que `pnpm-workspace.yaml` já cobre `apps/*` e `packages/*`. Se não, atualizar.
3. Validar a presença de `turbo.json`. Se ausente, criar com pipelines básicos:
   - `dev`: executa `pnpm --filter ... dev` para apps relevantes
   - `build`: `pnpm turbo run build`
   - `lint`: `pnpm turbo run lint`
4. Criar skeletons de `packages/eslint` e `packages/tsconfig` contendo apenas o essencial e `package.json` com `name` e
   `version` (não publicar).
5. Adicionar um `docs/features/historia-1.1-configuracao-ambiente-monorepo.md` (este arquivo) e referenciar-o no
   `docs/development/tasks.md` (opcional, como próximo passo).
6. Criar um `.env.example` na raiz contendo variáveis mínimas exigidas (ex: `DATABASE_URL`, `JWT_SECRET`) e documentar o
   uso do `doppler` no `README.md` e aqui.

Comandos úteis (para desenvolvedores locais):

```bash
# instalar dependências (raiz)
pnpm install

# iniciar apps em dev (turbo)
pnpm dev

# rodar lint em todos os workspaces
pnpm turbo run lint
```

> Observação: O projeto já inclui scripts e arquivos (ex: `pnpm-workspace.yaml`, `turbo.json`) — a implementação desta
> história deve validar e complementar o que já existe, evitando duplicação.

## Critérios de Aceitação (DoD)

- `pnpm install` funciona na raiz sem erros.
- `pnpm dev` inicia o(s) app(s) configurado(s) em dev (HMR para frontend quando aplicável).
- `turbo.json` contém pipelines básicos e `pnpm turbo run build` executa nas workspaces.
- Os pacotes `packages/eslint` e `packages/tsconfig` existem com arquivos mínimos e são referenciáveis pelos apps.
- `.env.example` e instruções de uso do Doppler estão presentes.

## Testing Strategy

- Testes manuais iniciais:
  - `pnpm install` na raiz
  - `pnpm dev` e verificar se `apps/web` e `apps/api` (quando aplicável) iniciam
  - `pnpm turbo run lint` e `pnpm turbo run build`

- Automatização (próximo passo):
  - Workflow de CI (`.github/workflows/ci.yml`) que roda `pnpm turbo run lint` e `pnpm turbo run build` para PRs.

## Dependencies

- `pnpm` (versão compatível com `pnpm-workspace.yaml`)
- `turbo` (Turborepo CLI)
- `doppler` (para gerenciamento de segredos; opcional localmente mas documentado)

## Future Considerations

- Publicar os pacotes `packages/eslint` e `packages/tsconfig` em um registro interno (opcional) para uso cross-repo.
- Implementar templates adicionais (eg. `packages/config/prettier`, já existe) e consolidar em um `@govtech/config`
  monorepo.

---

## Mapeamento para Requirements & Design

- Alinha-se com `REQ-NF-050` (Setup de Ambiente Local) ao reduzir tempo de setup.
- Segue o DTD (Design) que exige `pnpm`, `turbo`, `TypeScript` e pacotes compartilhados.
- Documentação criada primeiro conforme `AGENTS.md` (Documentação First).

## Próximos Passos Imediatos

1. Validar `pnpm-workspace.yaml` e `turbo.json` existentes.
2. Criar skeletons em `packages/eslint` e `packages/tsconfig` (baixo risco).
3. Implementar `T-101` (inicialização/validação pnpm) — começar a codificar/configurar.

---

## Nota sobre CI e Assets

Adicionei um workflow de CI em `.github/workflows/ci.yml` que executa as verificações básicas:

- Instala dependências com `pnpm install --frozen-lockfile`.
- Executa `node ./scripts/check_mobile_assets.js` para validar cabeçalhos de imagens na pasta `apps/mobile/assets`.
- Executa `pnpm -w lint`, `pnpm -w test` e `pnpm build`.

Também incluí um script auxiliar `scripts/replace_mobile_placeholders.js` que facilita substituir os placeholders 1x1
por imagens finais quando você provê um diretório com os arquivos `icon.png`, `splash.png`, `favicon.png` e
`adaptive-icon.png`.

Recomenda-se habilitar a checagem de assets no CI para impedir regressões (imagem textual no lugar de binárias).

---

Generated: 2025-09-19
