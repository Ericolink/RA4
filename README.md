Aquí tienes **TODO el contenido listo para copiar y pegar directamente en tu archivo `README.md`**.
Sin formato extraño, sin comentarios extra. Solo pega y guarda.

---

# 📄 README — Despliegue de la Aplicación Web One Piece con Docker y Nube

## 🚀 Descripción del Proyecto

Este proyecto despliega una aplicación web desarrollada en Node.js que muestra un mini catálogo de One Piece. El despliegue se realiza mediante contenedores Docker y servicios en la nube utilizando Infraestructura como Código (IaC).

La app muestra:

* Personajes
* Tesoros
* Recetas

Todos los datos se almacenan en una base de datos PostgreSQL.

---

# 🐳 1. Despliegue Local con Docker

## Requisitos Previos

* Docker Desktop instalado
* (Opcional) Node.js para pruebas locales sin Docker

---

## Estructura del Proyecto

```
/
├── Dockerfile
├── package.json
├── package-lock.json
└── index.js
```

---

## Construir la Imagen Docker

Ejecutar desde la carpeta del proyecto:

```
docker build -t onepiece-app .
```

---

## Ejecutar el Contenedor Localmente

```
docker run -p 3000:3000 onepiece-app
```

Abrir en el navegador:
http://localhost:8080/

---

# ☁️ 2. Subir la Imagen al Registro (Docker Hub)

## 1. Iniciar sesión en Docker Hub

```
docker login
```

## 2. Etiquetar la imagen

```
docker tag onepiece-app tu_usuario/onepiece-app:v1
```

## 3. Subir la imagen

```
docker push tu_usuario/onepiece-app:v1
```

---

# ☁️ 3. Despliegue en la Nube (Infraestructura como Código)

El despliegue en la nube incluye:

* Servicio de contenedores 
* Base de datos administrada
* Balanceador de carga
* Certificado SSL
* Dominio
* Automatización mediante Terraform u otra IaC

---

## Pasos para desplegar con IaC

### 1. Configurar credenciales

desde render se configurara todo o depende del servidor a utilizar

```

### 2. Inicializar Terraform

```
terraform init
```

### 3. Ver plan de ejecución

```
terraform plan
```

### 4. Aplicar cambios

```
terraform apply -auto-approve
```

Una vez completado, Terraform te devolverá:

* La URL del balanceador
* El dominio asignado
* Certificado SSL configurado

---

# 🌐 4. Acceso a la Aplicación en la Nube

El acceso dependerá del proveedor de nube.
Ejemplos:

RENDER:
https://ra4.onrender.com
---

# 🧪 5. Pruebas (Opcional)

Si se incluye un script de pruebas:

```
npm test
```

---

# 📘 6. Diagrama de Arquitectura (Descripción)

```
Usuario
   |
   ▼
Balanceador de Carga
   |
   ▼
Servicio de Contenedores
   |
   ▼
Contenedor Docker de la App One Piece
   |
   ▼
Base de Datos Administrada
```

---

# 📝 7. Información del Estudiante

**Alumno:** Eric Munoz
**Materia:** Arquitectura de Software
**Año:** 2025

---

# ✔️ 8. Conclusión

Este proyecto demuestra el proceso completo para desplegar una aplicación web usando contenedores Docker e infraestructura en la nube automatizada con IaC. Incluye la construcción local, publicación en un registro, despliegue en la nube y exposición mediante un balanceador con dominio y SSL.

