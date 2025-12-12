# Imagen base
FROM node:18

# Crear directorio de la app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
