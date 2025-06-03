-- Desactiva restricciones temporales para poder borrar en orden libre (PostgreSQL)
-- (Útil si tienes triggers, no siempre es necesario)
-- SET session_replication_role = replica;

-- Borrar en orden inverso a las relaciones (para evitar errores por claves foráneas)
DELETE FROM "Calificaciones";
DELETE FROM "Pagos";
DELETE FROM "Sesiones";
DELETE FROM "TutorMateria";
DELETE FROM "TutoresInfo";
DELETE FROM "Materias";
DELETE FROM "Notificaciones";
DELETE FROM "Bitacora";
DELETE FROM "Usuarios";
DELETE FROM "Roles";
DELETE FROM "Perfiles";

-- Reiniciar IDs (secuencias) de las tablas con autoincrement
DO $$
DECLARE
  seq_name text;
BEGIN
  FOR seq_name IN
    SELECT pg_get_serial_sequence(quote_ident(schemaname) || '.' || quote_ident(tablename), columnname)
    FROM pg_catalog.pg_sequences
    JOIN information_schema.columns c ON c.table_name = pg_sequences.relname
    WHERE column_default LIKE 'nextval%'
  LOOP
    EXECUTE format('ALTER SEQUENCE %I RESTART WITH 1', seq_name);
  END LOOP;
END$$;

-- SET session_replication_role = DEFAULT;
