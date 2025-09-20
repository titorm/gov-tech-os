output "db_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = aws_db_instance.staging_postgres.address
}

output "db_port" {
  value = aws_db_instance.staging_postgres.port
}
