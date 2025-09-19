# GovTech OS - Documento de Requisitos Detalhados (DRD)

**Versão:** 1.1 **Status:** Para Aprovação **Foco:** MVP do Módulo de Gestão Financeira Unificada

## 1. Introdução

Este documento é a fonte única da verdade para todos os requisitos do produto GovTech OS, focando no escopo do Minimum
Viable Product (MVP). Sua finalidade é traduzir a visão de negócio e as necessidades do usuário, personificadas em
"Marcela, a Secretária de Finanças", em um conjunto de especificações formais que guiarão as equipes de Design,
Engenharia e Qualidade.

Adotamos a notação **EARS (Easy Approach to Requirements Syntax)** sempre que possível. Esta sintaxe estruturada nos
força a definir pré-condições, gatilhos e respostas esperadas do sistema, eliminando a ambiguidade inerente à linguagem
natural. Para um produto de software governamental, onde a precisão é primordial, essa clareza não é um luxo, mas uma
necessidade fundamental para evitar retrabalho, garantir a qualidade e construir uma base de testes automatizados
sólida.

---

## 2. Requisitos Funcionais (Functional Requirements)

Estes requisitos descrevem o comportamento explícito do sistema, ou seja, "o que o sistema deve fazer".

### 2.1. Gestão de Acesso e Autenticação de Usuários

A segurança e o controle de acesso são os pilares da confiança na plataforma.

- **REQ-F-001 [Login de Usuário]:** O sistema **deverá** fornecer uma interface de login segura na URL raiz da
  aplicação, solicitando um endereço de e-mail e uma senha.
- **REQ-F-002 [Autenticação Bem-Sucedida]:** `QUANDO` um usuário submeter um par de e-mail e senha que corresponda a um
  registro de usuário ativo, `O SISTEMA DEVERÁ` validar as credenciais, estabelecer uma sessão de usuário segura e
  redirecionar o usuário para a rota `/dashboard`.
- **REQ-F-003 [Credenciais Inválidas]:** `QUANDO` um usuário submeter um e-mail ou senha incorretos, `O SISTEMA DEVERÁ`
  exibir uma única mensagem de erro genérica (ex: "E-mail ou senha inválidos") e **não deverá**, por segurança, indicar
  qual dos dois campos estava incorreto.
- **REQ-F-004 [Bloqueio de Conta (Future)]:** `SE` uma conta de usuário registrar 5 tentativas de login falhas
  consecutivas, `O SISTEMA DEVERÁ` bloquear a conta por um período de 15 minutos.
- **REQ-F-005 [Logout de Usuário]:** `QUANDO` um usuário autenticado clicar na opção "Sair", `O SISTEMA DEVERÁ`
  invalidar a sessão do usuário (tanto no cliente quanto no servidor) e redirecioná-lo para a página de login.
- **REQ-F-006 [Controle de Acesso Baseado em Papel - RBAC]:** `SE` um usuário possuir o papel (role) de "manager",
  `O SISTEMA DEVERÁ` restringir todas as suas consultas de dados para retornar informações pertencentes exclusivamente
  aos municípios associados à sua conta na tabela `users_to_municipios`.

### 2.2. Dashboard Financeiro Unificado

O dashboard é a principal ferramenta de trabalho de "Marcela" e o core da proposta de valor do MVP.

- **REQ-F-010 [Visualização Inicial do Dashboard]:** `QUANDO` um usuário autenticado navegar para a rota `/dashboard`,
  `O SISTEMA DEVERÁ` exibir a estrutura do dashboard contendo um cabeçalho, uma barra de ações com um filtro de data e
  uma grade para os widgets financeiros.
- **REQ-F-011 [Estado de Carregamento de Dados]:** `ENQUANTO` os dados para os widgets do dashboard estiverem sendo
  buscados da API, `O SISTEMA DEVERÁ` exibir um indicador de carregamento visualmente claro para cada widget, como um
  efeito "skeleton" ou "shimmer", conforme especificado no documento de UI/UX.
- **REQ-F-012 [Estado de Erro na Busca de Dados]:** `ONDE` a API retornar um erro que impeça o carregamento dos dados do
  dashboard (ex: erro 500), `O SISTEMA DEVERÁ` exibir uma mensagem de erro em toda a área de conteúdo, com um título
  claro (ex: "Não foi possível carregar os dados") e um botão de ação primária para "Tentar Novamente".
- **REQ-F-013 [Filtragem por Período de Tempo]:** `QUANDO` o usuário selecionar uma nova opção no filtro de data (ex:
  "Último Trimestre"), `O SISTEMA DEVERÁ` executar uma nova busca de dados na API com os parâmetros de data
  correspondentes e atualizar todos os widgets na tela com as novas informações.
- **REQ-F-014 [Estado Vazio de Dados]:** `ONDE` uma busca de dados for bem-sucedida mas não retornar registros para o
  período de tempo selecionado, `O SISTEMA DEVERÁ` exibir um "estado vazio" dentro de cada widget, com um título
  informativo (ex: "Nenhum dado encontrado") e uma descrição que sugira ao usuário ajustar o filtro.
- **REQ-F-015 [Widget de Receita]:** O sistema **deverá** apresentar um widget intitulado "Arrecadado vs. Orçado" que
  exiba visualmente (gráfico de linha ou barra) a receita total realizada em comparação com a receita prevista para o
  período selecionado.
- **REQ-F-016 [Widget de Despesas]:** O sistema **deverá** apresentar um widget intitulado "Despesas por Função" que
  exiba visualmente (gráfico de pizza ou rosca) a distribuição percentual das despesas entre as principais funções
  governamentais (ex: Saúde, Educação, Segurança).

### 2.3. Geração de Relatórios

Capacitar "Marcela" a prestar contas de forma eficiente.

- **REQ-F-020 [Geração de PDF]:** `QUANDO` o usuário clicar no botão "Gerar Relatório" na barra de ações do dashboard,
  `O SISTEMA DEVERÁ` iniciar a geração de um arquivo no formato PDF.
- **REQ-F-021 [Conteúdo do Relatório]:** O PDF gerado **deverá** conter:
  1.  Um cabeçalho com o nome do Município e o período de tempo dos dados.
  2.  Representações visuais (imagens estáticas dos gráficos) de todos os widgets atualmente visíveis no dashboard.
  3.  A data e hora em que o relatório foi gerado.
- **REQ-F-022 [Feedback da Ação]:** `APÓS` a conclusão bem-sucedida da geração do relatório, `O SISTEMA DEVERÁ` exibir
  uma notificação transitória (snackbar/toast) com uma mensagem de sucesso (ex: "Relatório gerado com sucesso!") e
  iniciar o download do arquivo no navegador do usuário.

---

## 3. Requisitos Não-Funcionais (Non-Functional Requirements)

Estes requisitos definem os atributos de qualidade do sistema, ou seja, "como o sistema deve se comportar".

### 3.1. Performance e Responsividade

- **REQ-NF-001 [Carregamento da Página]:** O sistema **deverá** atingir as seguintes métricas de Core Web Vitals para a
  página do dashboard:
  - **Largest Contentful Paint (LCP):** inferior a 3.0 segundos.
  - **First Input Delay (FID):** inferior a 100 milissegundos.
  - **Cumulative Layout Shift (CLS):** inferior a 0.1.
- **REQ-NF-002 [Latência da API]:** As requisições da API para leitura de dados (GET) **deverão** ter uma latência `p99`
  (percentil 99) inferior a 800ms sob uma carga de 100 usuários concorrentes.
- **REQ-NF-003 [Responsividade da UI]:** Todas as interações do usuário na interface (cliques, digitação, seleção de
  filtros) **deverão** registrar uma resposta visual em menos de 200ms.

### 3.2. Segurança

- **REQ-NF-010 [Mitigação OWASP Top 10]:** O sistema **deverá** ser projetado e implementado com defesas contra as 10
  vulnerabilidades de segurança mais críticas do OWASP, incluindo, mas não se limitando a, Injeção (SQL, XSS) e Quebra
  de Autenticação.
- **REQ-NF-011 [Política de Segurança de Conteúdo - CSP]:** O sistema **deverá** implementar um cabeçalho HTTP
  `Content-Security-Policy` restritivo para mitigar ataques de Cross-Site Scripting (XSS) e injeção de dados.
- **REQ-NF-012 [Proteção CSRF]:** `SE` a autenticação de sessão for utilizada no futuro, `O SISTEMA DEVERÁ` implementar
  um mecanismo de proteção contra Cross-Site Request Forgery (CSRF), como o padrão de token duplo.
- **REQ-NF-013 [Cabeçalhos de Segurança HTTP]:** O sistema **deverá** utilizar cabeçalhos de segurança HTTP, incluindo
  `X-Content-Type-Options: nosniff`, `Strict-Transport-Security (HSTS)` e `X-Frame-Options: DENY`.
- **REQ-NF-014 [Validação de Entrada]:** O sistema **deverá** validar rigorosamente todas as entradas de dados na camada
  da API (corpo, parâmetros, queries) contra um esquema predefinido (Zod) para garantir tipo, formato e comprimento.

### 3.3. Confiabilidade e Escalabilidade

- **REQ-NF-020 [Disponibilidade de Serviço]:** O sistema **deverá** manter uma disponibilidade de serviço (uptime) de
  99.95% ou superior, medida mensalmente.
- **REQ-NF-021 [Escalabilidade Horizontal]:** A arquitetura do container da API **deverá** ser stateless, permitindo a
  escalabilidade horizontal (adicionando mais instâncias) para lidar com o aumento da carga de requisições sem
  degradação do serviço.
- **REQ-NF-022 [Backups de Banco de Dados]:** O sistema **deverá** ter uma política de backup automatizada para o banco
  de dados PostgreSQL, com backups diários e capacidade de Point-in-Time Recovery (PITR) para os últimos 7 dias.

### 3.4. Observabilidade

- **REQ-NF-030 [Logging Estruturado]:** Todas as saídas de log da API **deverão** ser em formato JSON estruturado,
  contendo, no mínimo, `timestamp`, `log_level`, `message`, e um `request_id` para correlação de eventos.
- **REQ-NF-031 [Métricas Chave]:** O sistema **deverá** expor métricas essenciais para monitoramento, incluindo taxa de
  requisições (throughput), taxa de erros (HTTP 5xx), e latência das requisições da API.
- **REQ-NF-032 [Tracing Distribuído]:** O sistema **deverá** implementar tracing distribuído (via OpenTelemetry) para
  permitir o rastreamento de uma requisição desde o frontend, através da API, até o banco de dados.

### 3.5. Acessibilidade (A11y)

- **REQ-NF-040 [Conformidade WCAG]:** A aplicação web **deverá** ser totalmente aderente às diretrizes do Web Content
  Accessibility Guidelines (WCAG) 2.1 no nível AA.
- **REQ-NF-041 [Navegação por Teclado]:** `QUANDO` um usuário utilizar a tecla `Tab`, `O SISTEMA DEVERÁ` mover o foco de
  forma lógica e previsível através de todos os elementos interativos da página. Um indicador de foco visível e com alto
  contraste **deverá** estar sempre presente.
- **REQ-NF-042 [Compatibilidade com Leitores de Tela]:** Todos os elementos não-textuais (ícones, gráficos) **deverão**
  ter alternativas textuais (`aria-label`, `alt-text`). Gráficos complexos **deverão** ser acompanhados por uma tabela
  de dados acessível a leitores de tela.

### 3.6. Experiência do Desenvolvedor (DX)

- **REQ-NF-050 [Setup de Ambiente Local]:** O tempo total para um novo engenheiro clonar o repositório e ter todos os
  serviços (frontend, backend, banco de dados) rodando localmente **não deverá** exceder 15 minutos.
- **REQ-NF-051 [Feedback Rápido]:** O sistema de build **deverá** suportar Hot Module Replacement (HMR) tanto para o
  frontend quanto para o backend, permitindo que alterações no código sejam refletidas no ambiente de desenvolvimento em
  menos de 3 segundos.
