variable "region" {
  type    = string
  default = "us-east-1"
}

variable "db_name" {
  type    = string
  default = "govtech_staging"
}

variable "db_username" {
  type    = string
  default = "govtech_admin"
}

variable "db_password" {
  type    = string
  description = "Sensitive - provide via terraform.tfvars or CI secrets"
  default = ""
}

variable "instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "engine_version" {
  type    = string
  default = "15"
}

variable "allocated_storage" {
  type    = number
  default = 20
}

variable "db_subnet_ids" {
  type = list(string)
  default = []
}

variable "security_group_ids" {
  type = list(string)
  default = []
}
