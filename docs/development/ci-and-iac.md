# CI & IaC (Integração Contínua e Infraestrutura como Código)

Este documento descreve a configuração inicial do workflow de CI e um template Terraform para provisionar o banco de
dados de _staging_.

## Objetivos

- Garantir que PRs executem lint e build antes de permitir merge.
- Adicionar um stage para testes e coleta de coverage.
- Fornecer um template Terraform para provisionar um PostgreSQL de staging com estado remoto.

## Arquivos adicionados

- `.github/workflows/ci.yml` - workflow de CI para PRs
- `infra/terraform/staging/` - templates Terraform iniciais (`main.tf`, `variables.tf`, `outputs.tf`, `README.md`)

## Como usar

1. Para CI, basta abrir PR contra a branch `develop` (workflow dispara automaticamente).
2. Para Terraform, configure um backend remoto (S3/State service) e defina as variáveis descritas em
   `infra/terraform/staging/README.md`.

---

Notas de segurança: nunca commitar segredos em texto plano. Use Doppler/Secrets Manager para variáveis sensíveis e
configure `terraform.tfvars` localmente ou via pipeline seguro.
