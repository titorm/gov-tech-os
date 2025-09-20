# Terraform — Staging (Documentation)

This document describes how to use the Terraform templates in `infra/terraform/staging/` to provision the staging
PostgreSQL instance and related infrastructure.

Overview

- The repo includes an example backend configuration: `infra/terraform/staging/backend.tf.example`. Copy and customize
  to create your own `backend.tf`.
- CI: A GitHub Actions workflow `terraform-plan.yml` runs on PRs altering `infra/terraform/**` and uploads the generated
  plan as an artifact for reviewers.

Local setup

1. Prepare a remote backend (recommended): S3 bucket + DynamoDB table (for AWS) or Terraform Cloud.
2. Copy `backend.tf.example` to `infra/terraform/staging/backend.tf` and update values.
3. Copy `terraform.tfvars.example` to `infra/terraform/staging/terraform.tfvars` and fill in non-sensitive values.
   Supply secrets through environment variables or use CI secrets.

CI integration

- The `terraform-plan.yml` workflow initializes Terraform without a backend (to keep PRs safe), validates and generates
  a `tfplan` artifact.
- Reviewers can download the `tfplan` artifact to inspect planned changes.

Apply policy

- `terraform apply` should be run only from an authorized runner or manually from a maintainer workstation. Consider
  adding a protected workflow to run `apply` that requires approvals and stores credentials safely.

Restoration of replaced mobile images

- Original mobile images that were replaced (to unblock build) are stored encoded in
  `infra/backups/mobile-images/ORIGINALS_BASE64.md`.

Contact

- If you need help wiring the backend or secrets for CI, ping the infra team and provide the intended provider and
  account details (do NOT post secrets in PRs).
