# Terraform - Staging (PostgreSQL)

Este diretório contém um template Terraform para provisionar um banco de dados PostgreSQL no ambiente de `staging`.

ATENÇÃO: Este é um template inicial. Não commite segredos (ex: `db_password`) no repositório.

Recomendações:

- Use um backend remoto para o state (ex: S3 + DynamoDB, or Terraform Cloud).
- Injete variáveis sensíveis via CI secrets ou via gerenciador de segredos (Doppler, Vault).
- Ajuste provedores e recursos conforme seu provedor de nuvem (AWS, GCP, Azure, Supabase).

Exemplo de uso local:

1. Copie `terraform.tfvars.example` para `terraform.tfvars` e preencha as variáveis.
2. Configure o backend remoto via `backend` block em `main.tf` ou via `-backend-config`.
3. Execute:

```bash
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```
