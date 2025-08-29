#!/bin/bash
# scripts/start-full-app.sh

set -e

echo "🚀 Iniciando aplicación completa..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor, inicia Docker Desktop."
    exit 1
fi

# Crear archivo de variables de entorno si no existe
if [ ! -f ".env.full" ]; then
    echo "📝 Creando variables de entorno..."
    cat > .env.full << EOF
# Database
DB_USER=app_user
DB_PASSWORD=app_password
DB_NAME=app_database
DB_PORT=5432

# Backend
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development

# Frontend
EXPO_PORT=19000
EXPO_DEV_PORT=19001
EXPO_TOOLS_PORT=19002
METRO_PORT=8081
FRONTEND_HOST=localhost

# Nginx
NGINX_PORT=80
EOF
fi

# Crear .env para Backend si no existe
if [ ! -f "./Backend/.env" ]; then
    echo "📝 Creando .env para Backend..."
    cat > ./Backend/.env << EOF
NODE_ENV=development
DATABASE_URL=postgresql://app_user:app_password@database:5432/app_database
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_change_in_production
EOF
fi

# Crear .env para Frontend si no existe
if [ ! -f "./Frontend/.env" ]; then
    echo "📝 Creando .env para Frontend..."
    cat > ./Frontend/.env << EOF
EXPO_PUBLIC_API_URL=http://localhost/api
EXPO_PUBLIC_IS_DEV_MODE=true
EOF
fi

echo "🔧 Construyendo todos los containers..."
docker-compose --env-file .env.full -f docker-compose.full.yml build --parallel

echo "🏃‍♂️ Levantando todos los servicios..."
docker-compose --env-file .env.full -f docker-compose.full.yml up -d

echo "⏳ Esperando que todos los servicios estén listos..."
sleep 30

echo "🏥 Verificando salud de los servicios..."
docker-compose --env-file .env.full -f docker-compose.full.yml ps

echo "✅ Aplicación completa lista!"
echo ""
echo "🌐 Servicios disponibles:"
echo "  📱 Frontend (Expo): http://localhost:19000"
echo "  📡 API Backend: http://localhost/api"
echo "  🗄️  Database: localhost:5432"
echo "  🔀 Load Balancer: http://localhost"
echo ""
echo "📋 Comandos útiles:"
echo "  Ver logs: docker-compose --env-file .env.full -f docker-compose.full.yml logs -f [servicio]"
echo "  Parar: docker-compose --env-file .env.full -f docker-compose.full.yml down"
echo "  Reset completo: docker-compose --env-file .env.full -f docker-compose.full.yml down -v"
echo "  Rebuild: docker-compose --env-file .env.full -f docker-compose.full.yml up --build"
