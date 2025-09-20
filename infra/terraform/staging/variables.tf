variable "region" {
  type    = string
  default = "us-east-1"
}

variable "instance_class" {
  type    = string
  default = "db.t3.micro"
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
  description = "Sensitive - set via CI or terraform.tfvars locally"
  default = ""
}
