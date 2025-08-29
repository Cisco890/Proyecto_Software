#!/bin/bash
# scripts/start-backend.sh

set -e

echo "🚀 Iniciando Backend + Database..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor, inicia Docker Desktop."
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f "./Backend/.env" ]; then
    echo "📝 Creando archivo .env para Backend..."
    cat > ./Backend/.env << EOF
NODE_ENV=development
DATABASE_URL=postgresql://backend_user:backend_pass@localhost:5432/backend_db
PORT=3001
JWT_SECRET=your_jwt_secret_here_change_in_production
EOF
fi

# Crear archivo de variables para Docker Compose si no existe
if [ ! -f ".env.backend" ]; then
    echo "📝 Creando variables de entorno para Docker..."
    cat > .env.backend << EOF
DB_USER=backend_user
DB_PASSWORD=backend_pass
DB_NAME=backend_db
DB_PORT=5432
API_PORT=3001
NODE_ENV=development
EOF
fi

echo "🔧 Construyendo containers..."
docker-compose --env-file .env.backend -f docker-compose.backend.yml build

echo "🏃‍♂️ Levantando servicios..."
docker-compose --env-file .env.backend -f docker-compose.backend.yml up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 15

echo "🏥 Verificando salud de los servicios..."
docker-compose --env-file .env.backend -f docker-compose.backend.yml ps

echo "✅ Backend listo!"
echo "📡 API disponible en: http://localhost:3001"
echo "🗄️  Database disponible en: localhost:5432"
echo ""
echo "📋 Comandos útiles:"
echo "  Ver logs: docker-compose --env-file .env.backend -f docker-compose.backend.yml logs -f"
echo "  Parar servicios: docker-compose --env-file .env.backend -f docker-compose.backend.yml down"
echo "  Resetear DB: docker-compose --env-file .env.backend -f docker-compose.backend.yml down -v"
