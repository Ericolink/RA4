output "alb_dns_name" {
  value = aws_lb.web_alb.dns_name
}

output "ecs_service_name" {
  value = aws_ecs_service.web_service.name
}

output "db_endpoint" {
  value = aws_db_instance.app_db.endpoint
}
