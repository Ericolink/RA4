# Imagen base Node.js
FROM node:20

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]
