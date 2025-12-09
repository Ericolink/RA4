variable "vpc_id" {}
variable "public_subnets" {
  type = list(string)
}

variable "domain_name" {
  description = "Dominio para la app (ej: midominio.com)"
  type        = string
}

variable "docker_image" {
  description = "Imagen de Docker Hub con la app"
  type        = string
}

variable "db_password" {
  description = "Contraseña de la base de datos"
  type        = string
  sensitive   = true
}
