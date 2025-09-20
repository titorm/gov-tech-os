terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_db_subnet_group" "staging" {
  name       = "govtech-staging-subnet-group"
  subnet_ids = var.db_subnet_ids
  tags = {
    Name = "govtech-staging-db-subnet-group"
  }
}

resource "aws_db_instance" "staging_postgres" {
  identifier              = "govtech-staging-db"
  engine                  = "postgres"
  engine_version          = var.engine_version
  instance_class          = var.instance_class
  allocated_storage       = var.allocated_storage
  name                    = var.db_name
  username                = var.db_username
  password                = var.db_password
  db_subnet_group_name    = aws_db_subnet_group.staging.name
  vpc_security_group_ids  = var.security_group_ids
  skip_final_snapshot     = true
  publicly_accessible     = false
  backup_retention_period = 7
  apply_immediately       = false
  tags = {
    Environment = "staging"
    Project     = "govtech"
  }
}
