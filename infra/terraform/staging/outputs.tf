output "db_endpoint" {
  description = "Connection endpoint for the staging database"
  value       = "${var.db_name}.example.local"
}

output "db_name" {
  value = var.db_name
}
