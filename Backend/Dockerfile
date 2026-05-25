# Etapa 1: Construcción
FROM node:18-alpine

# Instalar OpenSSL y otras dependencias necesarias
RUN apk add --no-cache openssl postgresql-client

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de dependencias primero
COPY package*.json ./

# Instalar todas las dependencias incluyendo las de desarrollo
RUN npm install

# Copiar el resto del código al contenedor
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Exponer el puerto en el que corre Express (puedes ajustarlo si usas otro)
EXPOSE 3001

# Comando para ejecutar la app
CMD ["node", "app.js"]
