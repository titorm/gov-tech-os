# GovTech OS - Documento de Design Técnico Detalhado (DTD)

**Versão:** 1.1 **Status:** Para Aprovação **Foco:** Arquitetura do Sistema, Padrões e Fluxos do MVP

## 1. Introdução e Filosofia de Design

Este Documento de Design Técnico (DTD) serve como a "Constituição" para a engenharia da GovTech OS. Ele vai além do "o
quê" (descrito no DRD) e mergulha profundamente no "como" e no "porquê" de nossas escolhas arquitetônicas. O objetivo é
criar um sistema que não apenas atenda aos requisitos funcionais, mas que seja também resiliente, escalável, seguro e,
crucialmente, um prazer para os desenvolvedores construírem e manterem.

Nossa filosofia de design é guiada pelos seguintes princípios fundamentais:

- **Type-Safety de Ponta a Ponta (End-to-End Type Safety):** Somos obcecados por eliminar classes inteiras de bugs em
  tempo de compilação. Nossa arquitetura busca um contrato de dados unificado, compartilhando tipos e esquemas entre o
  banco de dados (Drizzle), o backend (Zod/Fastify) e o frontend (TypeScript/Tanstack Query).
- **Developer Experience (DX) como um Multiplicador de Força:** O tempo e a energia cognitiva dos desenvolvedores são
  nossos recursos mais preciosos. Investimos pesadamente em automação (Turborepo), tooling de alta performance (Vite,
  Fastify) e processos claros para criar um ambiente de fluxo contínuo.
- **Observabilidade por Design:** Não tratamos logging, métricas e tracing como uma reflexão tardia. A arquitetura é
  projetada desde o início para ser observável, permitindo-nos entender o comportamento do sistema em produção e tomar
  decisões baseadas em dados.
- **Arquitetura Limpa e Desacoplada:** Buscamos um baixo acoplamento e alta coesão. O frontend é agnóstico em relação à
  lógica de negócio do backend. O backend é agnóstico em relação à persistência dos dados. Isso permite que cada parte
  do sistema evolua de forma independente.

---

## 2. Arquitetura do Sistema (Modelo C4 Detalhado)

### 2.1. Nível 1: Contexto do Sistema

O sistema **GovTech OS** existe dentro de um ecossistema de gestão pública. Seu principal ator é a **Gestora Pública**
(ex: Marcela, Secretária de Finanças), que interage com a plataforma via HTTPS. O sistema consome dados de **Sistemas
Municipais Legados** (via APIs, dumps de banco de dados, etc.) e utiliza serviços externos como o **Resend** para
funcionalidades de notificação e envio de relatórios via e-mail.

### 2.2. Nível 2: Contêineres

A plataforma GovTech OS é composta por três contêineres principais, implantados de forma independente, que se comunicam
por meio de APIs bem definidas.

1.  **`Frontend App (React SPA)`**
    - **Responsabilidades:** Toda a renderização da interface do usuário, gerenciamento de estado da UI e do estado do
      servidor (cache de dados), e a orquestração das interações do usuário. É uma aplicação "burra" no sentido de que
      não contém lógica de negócio crítica.
    - **Tecnologias Chave:** React para a UI declarativa, Vite para um build e desenvolvimento ultrarrápido, Tanstack
      Query para um gerenciamento sofisticado do estado do servidor (caching, revalidação, etc.), e Tanstack Router para
      roteamento type-safe.
    - **Interações:** Comunica-se exclusivamente com o Backend API via requisições HTTPS/JSON. Não tem acesso direto ao
      banco de dados.

2.  **`Backend API (Node.js Service)`**
    - **Responsabilidades:** É o cérebro do sistema. Lida com a autenticação (geração e validação de JWTs), autorização
      (RBAC), validação de todas as requisições, orquestração da lógica de negócio, e serve como a única porta de
      entrada para o banco de dados.
    - **Tecnologias Chave:** Node.js para o runtime, Fastify como o framework web de alta performance, Zod para a
      definição e validação de esquemas, e Drizzle ORM como a camada de acesso a dados.
    - **Interações:** Expõe uma API RESTful para o Frontend App. Conecta-se ao Banco de Dados PostgreSQL para persistir
      e recuperar dados.

3.  **`Database (PostgreSQL)`**
    - **Responsabilidades:** Garantir a integridade, durabilidade e consistência dos dados (ACID). Armazena dados de
      usuários, configurações de municípios, papéis, e os dados financeiros agregados que alimentam os dashboards.
    - **Tecnologias Chave:** PostgreSQL, escolhido por sua robustez, extensibilidade (JSONB, PostGIS) e ecossistema
      maduro.
    - **Interações:** Aceita conexões apenas do Backend API. O acesso direto de qualquer outro contêiner é estritamente
      proibido por regras de firewall.

---

## 3. Design Detalhado do Backend

### 3.1. API Design e Padrões RESTful

- **Versionamento:** A API será versionada via URL prefix (`/api/v1`). Isso garante que futuras alterações que quebrem a
  compatibilidade possam ser introduzidas em uma nova versão (`/api/v2`) sem impactar os clientes existentes.
- **Formato de Resposta Padrão:**
  - **Sucesso (2xx):** O corpo da resposta conterá os dados solicitados em formato JSON.
  - **Erro (4xx/5xx):** O corpo da resposta conterá um objeto JSON padronizado para facilitar o tratamento de erros no
    cliente:
    ```json
    {
      "statusCode": 400,
      "error": "Bad Request",
      "message": "O campo 'email' deve ser um endereço de e-mail válido.",
      "issues": [{ "path": "email", "message": "..." }] // Opcional, para erros de validação
    }
    ```
- **Autenticação:** Todas as rotas, exceto as de login (`/auth/login`) e health check (`/health`), serão protegidas e
  exigirão um `Authorization: Bearer <JWT>` header.

### 3.2. Fluxo de Autenticação com JWT (Access + Refresh Tokens)

Para balancear segurança e usabilidade, adotamos o padrão de tokens de acesso e de atualização.

1.  **Login:** O usuário envia `email` e `password` para `POST /api/v1/auth/login`.
2.  **Validação:** O servidor usa `bcrypt.compare` para verificar a senha.
3.  **Geração de Tokens:**
    - **Access Token:** Um JWT de curta duração (15 minutos) é gerado. Seu payload contém `userId`, `role` e
      `municipioIds` para permitir decisões de autorização rápidas e stateless.
    - **Refresh Token:** Um token opaco e de longa duração (7 dias) é gerado e armazenado no banco de dados, associado
      ao `userId`.
4.  **Armazenamento:** O Access Token é retornado no corpo da resposta para uso imediato pela SPA. Ambos os tokens
    (Access e Refresh) são definidos em cookies `httpOnly`, `Secure`, `SameSite=Strict`, tornando-os inacessíveis a
    scripts maliciosos no navegador.
5.  **Uso:** O frontend utiliza o Access Token do corpo da resposta para as primeiras requisições. Para as subsequentes,
    o middleware de autenticação do backend extrairá o token do header `Authorization`.
6.  **Refresh da Sessão:** Quando o Access Token expira (resultando em um erro 401), um interceptador no frontend faz
    uma requisição para `POST /api/v1/auth/refresh`. O Refresh Token (enviado via cookie) é validado no banco de dados,
    e um novo par de Access/Refresh tokens é emitido, estendendo a sessão do usuário de forma transparente.

### 3.3. Modelo de Dados Detalhado com Drizzle

O schema completo, definido em `packages/db/schema.ts`, é a fonte da verdade para nossa estrutura de dados.

```typescript
import {
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
  primaryKey,
  pgEnum,
  integer,
  uniqueIndex,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Core de Autenticação e Acesso ---
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  hashedPassword: text('hashed_password').notNull(),
  role: userRoleEnum('role').default('manager').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const municipios = pgTable(
  'municipios',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    population: integer('population'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => {
    return {
      nameIdx: uniqueIndex('municipio_name_idx').on(table.name),
    };
  }
);

export const usersToMunicipios = pgTable(
  'users_to_municipios',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    municipioId: uuid('municipio_id')
      .notNull()
      .references(() => municipios.id, { onDelete: 'cascade' }),
  },
  t => ({ pk: primaryKey({ columns: [t.userId, t.municipioId] }) })
);

// --- Dados Agregados para o Dashboard Financeiro ---
export const financialSummaries = pgTable('financial_summaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  municipioId: uuid('municipio_id')
    .notNull()
    .references(() => municipios.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  revenueData: jsonb('revenue_data').$type<{ actual: number; budgeted: number }>(),
  expenseData: jsonb('expense_data').$type<{ byCategory: Array<{ category: string; amount: number }> }>(),
  lastRefreshed: timestamp('last_refreshed').defaultNow().notNull(),
});

// --- Relações para Joins Type-Safe ---
export const usersRelations = relations(users, ({ many }) => ({
  usersToMunicipios: many(usersToMunicipios),
}));
// ... (outras relações) ...
```

---

## 4. Design Detalhado do Frontend

### 4.1. Arquitetura de Componentes

Adotamos uma estrutura de pastas que diferencia componentes por sua função e reusabilidade:

- `src/components/core/`: Componentes de UI puros, agnósticos de aplicação (ex: `Button`, `Card`, `Input`, `Spinner`).
  Eles são altamente reutilizáveis e poderiam, eventualmente, ser publicados como um pacote de design system.
- `src/components/layout/`: Componentes que definem a estrutura da página (ex: `Header`, `Sidebar`, `PageLayout`).
- `src/features/`: O coração da aplicação. Cada feature (ex: `authentication`, `dashboard`) é um módulo autocontido que
  possui seus próprios componentes, hooks, e chamadas de API. Um componente em `features/dashboard` pode compor vários
  componentes de `core`.

### 4.2. Gerenciamento de Estado com Tanstack Query

Nós distinguimos claramente entre Estado da UI e Estado do Servidor.

- **Estado da UI:** (ex: se um modal está aberto, o conteúdo de um input de formulário). Gerenciado localmente em
  componentes com useState ou, para lógica mais complexa, useReducer. Evitamos gerenciadores de estado globais (como
  Redux) para o MVP, pois Tanstack Query elimina a necessidade de armazenar dados do servidor globalmente.

- **Estado do Servidor:** (dados que vêm da nossa API). Gerenciado exclusivamente pelo **Tanstack Query**.
  - **Busca de Dados (`useQuery`):**

  ```typescript
  // features/dashboard/api/getFinancialSummary.ts
  export const getFinancialSummary = (municipioId, filters) => {
    // ... Lógica da chamada com fetch/axios ...
  };

  // features/dashboard/components/Dashboard.tsx
  const { data, isLoading, isError } = useQuery({
    queryKey: ['financialSummary', municipioId, dateFilters],
    queryFn: () => getFinancialSummary(municipioId, dateFilters),
    staleTime: 5 * 60 * 1000, // Cache de 5 minutos
  });
  ```

  Mutações de dados (`useMutation`):

  ```typescript
  // features/authentication/components/LoginForm.tsx
  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: user => {
      // Invalida queries, redireciona, etc.
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.navigate({ to: '/dashboard' });
    },
    onError: error => {
      // Mostra notificação de erro.
    },
  });
  ```

### 4.3. Diagrama de Sequência Detalhado: Login e Visualização de Dashboard

```
sequenceDiagram
    participant User
    participant Frontend (React)
    participant Backend (Fastify)
    participant DB (Postgres)

    User->>Frontend: Clica em "Login" com email/senha
    Frontend->>Frontend: Ativa estado `isPending` do `useMutation` (desabilita botão)
    Frontend->>Backend: POST /api/v1/auth/login com payload JSON
    Backend->>Backend: Valida payload com Zod
    Backend->>DB: SELECT * FROM users WHERE email = $1
    DB-->>Backend: Retorna registro do usuário (incluindo hashedPassword)
    Backend->>Backend: Compara senha com bcrypt.compare
    alt Credenciais Válidas
        Backend->>Backend: Gera Access Token (15m) e Refresh Token (7d)
        Backend->>DB: UPDATE users SET refreshToken = $1 WHERE id = $2
        DB-->>Backend: Confirmação de update
        Backend-->>Frontend: Resposta 200 OK com Access Token no corpo. Define cookies httpOnly com ambos os tokens.
        Frontend->>Frontend: `onSuccess` do `useMutation`. Armazena user/token na memória. Redireciona para /dashboard.

        Frontend->>Backend: GET /api/v1/municipios/{id}/financials/summary com `Authorization: Bearer <token>`
        Backend->>Backend: Middleware de Auth verifica JWT (assinatura, expiração)
        Backend->>DB: SELECT * FROM financial_summaries WHERE ...
        DB-->>Backend: Retorna dados financeiros
        Backend-->>Frontend: Resposta 200 OK com dados JSON
        Frontend->>Frontend: `useQuery` armazena dados em cache e renderiza o dashboard
        Frontend-->>User: Exibe o dashboard completo
    else Credenciais Inválidas
        Backend-->>Frontend: Resposta 401 Unauthorized com objeto de erro JSON
        Frontend->>Frontend: `onError` do `useMutation`. Exibe mensagem de erro na UI.
    end
```
