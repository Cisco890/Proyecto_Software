#!/bin/bash

# Configuración
BACKUP_DIR="/backups"
POSTGRES_DB="mydb"
POSTGRES_USER="user"
DATE=$(date +"%Y%m%d_%H%M%S")

# Crear directorio de backup si no existe
mkdir -p $BACKUP_DIR

# Realizar backup
pg_dump -h database -U $POSTGRES_USER $POSTGRES_DB > "$BACKUP_DIR/backup_$DATE.sql"

# Mantener solo los últimos 7 backups
find $BACKUP_DIR -name "backup_*.sql" -type f -mtime +7 -delete
