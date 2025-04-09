FROM node:23-bullseye

# Instalar dependencias necesarias
RUN apt-get update && \
    apt-get install -y git curl python3 make g++ && \
    apt-get clean


WORKDIR /app

COPY package*.json ./

# Instalar Expo y dependencias globales necesarias
RUN npm install -g expo-cli @expo/ngrok

RUN npm install

COPY . .

EXPOSE 19000 19001 19002 8081

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

# Ejecutar Expo en modo completo 
CMD ["npx", "expo", "start", "--tunnel"]

