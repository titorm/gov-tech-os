// Terraform template - PostgreSQL (provider-agnostic examples and guidance)
terraform {
  required_version = ">= 1.3.0"
}

// Providers are left to be configured by the user. Example for AWS RDS is commented.

/*
provider "aws" {
  region = var.region
}

resource "aws_db_instance" "staging_postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = var.instance_class
  name                 = var.db_name
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true
  publicly_accessible  = false
}
*/

// For managed providers like Supabase or others, replace the above with provider-specific resources.
