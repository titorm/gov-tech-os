# Terraform — Staging

This folder contains Terraform artifacts and examples to provision the staging infrastructure for the project.

Files of interest

- `backend.tf.example` — Example backend configuration for S3 + DynamoDB locking. Copy to `backend.tf` and adjust the
  values to your environment before running `terraform init`.
- `terraform.tfvars.example` — Example variable values (non-sensitive). Create `terraform.tfvars` or use environment
  variables / CI secrets to supply sensitive values.

Quickstart (local, safe)

1. Create a new AWS S3 bucket and DynamoDB table for Terraform state locking.
2. Copy `backend.tf.example` to `backend.tf` and update `bucket`, `key`, `region` and `dynamodb_table`.
3. Configure AWS credentials in your environment (do not commit them):

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1
```

4. Initialize Terraform

```bash
cd infra/terraform/staging
terraform init
terraform validate
terraform plan -out=tfplan
```

CI notes

- A GitHub Actions workflow `terraform-plan.yml` exists that runs on PRs touching `infra/terraform/**`. The workflow
  runs `terraform init -backend=false` (safe for PRs), `terraform validate` and `terraform plan -out=tfplan`, then
  uploads the `tfplan` as an artifact for reviewers to download.
- Do NOT store credentials in the repository. Use GitHub Secrets (e.g. `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) or
  a pull-request approval gating strategy for any applies.

Apply strategy

- Treat `terraform apply` as a manually-run or protected job. Recommended process:
  1. Create a branch and open a PR with terraform changes (the PR will show a plan artifact).
  2. After reviews and approvals, run `terraform apply` from a CI job with restricted credentials or from a maintainer
     machine where credentials are available.

Security

- Use least-privilege AWS credentials for state management (S3 + DynamoDB). Consider using IAM roles for CI runners.
- Enable server-side encryption on the S3 bucket and enable versioning to protect against accidental deletes.

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
