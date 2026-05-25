#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Crear índices para mejorar el rendimiento
    CREATE INDEX IF NOT EXISTS idx_tutorias_tutor_id ON tutorias(tutor_id);
    CREATE INDEX IF NOT EXISTS idx_citas_estudiante_id ON citas(estudiante_id);
    
    -- Configurar zona horaria
    SET timezone = 'America/Guatemala';
EOSQL
