# Etapa 1: Construcción
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Instalar expo-cli globalmente
RUN npm install -g expo-cli

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer puertos necesarios para Expo
EXPOSE 19000 19001 19002 8081

# Comando para iniciar la aplicación
CMD ["npx", "expo", "start", "--tunnel"]
