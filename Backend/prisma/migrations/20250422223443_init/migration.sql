-- CreateEnum
CREATE TYPE "nivel_academico" AS ENUM ('primero', 'segundo', 'tercero', 'cuarto', 'quinto');

-- CreateEnum
CREATE TYPE "tipo_notificacion" AS ENUM ('recordatorio', 'alerta', 'mensaje', 'sistema');

-- CreateEnum
CREATE TYPE "metodo_pago" AS ENUM ('tarjeta', 'efectivo', 'transferencia');

-- CreateEnum
CREATE TYPE "estado_pago" AS ENUM ('pendiente', 'completado', 'rechazado', 'cancelado');

-- CreateEnum
CREATE TYPE "estado_sesion" AS ENUM ('pendiente', 'completada', 'en_curso', 'cancelada');

-- CreateEnum
CREATE TYPE "metodo_ensenanza" AS ENUM ('virtual', 'presencial', 'hibrido');

-- CreateEnum
CREATE TYPE "tipo_usuario" AS ENUM ('administrador', 'estudiante', 'tutor');

-- CreateTable
CREATE TABLE "Perfiles" (
    "id_perfil" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Perfiles_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id_rol" SERIAL NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "funcion" TEXT NOT NULL,
    "id_perfil" INTEGER NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo_electronico" VARCHAR(150) NOT NULL,
    "contrasena" TEXT NOT NULL,
    "tipo_usuario" "tipo_usuario" NOT NULL,
    "telefono" VARCHAR(20),
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_perfil" INTEGER,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "TutoresInfo" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "descripcion" TEXT,
    "tarifa_hora" DECIMAL(10,2),
    "experiencia" INTEGER,
    "disponibilidad" INTEGER,
    "metodo_ensenanza" "metodo_ensenanza",

    CONSTRAINT "TutoresInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materias" (
    "id_materia" SERIAL NOT NULL,
    "nombre_materia" VARCHAR(100) NOT NULL,

    CONSTRAINT "Materias_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "TutorMateria" (
    "id_tutor_materia" SERIAL NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,

    CONSTRAINT "TutorMateria_pkey" PRIMARY KEY ("id_tutor_materia")
);

-- CreateTable
CREATE TABLE "Bitacora" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_evento" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_origen" VARCHAR(45) NOT NULL,

    CONSTRAINT "Bitacora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_notificacion" "tipo_notificacion" NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "Sesiones" (
    "id_sesion" SERIAL NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duracion_min" INTEGER,
    "estado" "estado_sesion" NOT NULL,

    CONSTRAINT "Sesiones_pkey" PRIMARY KEY ("id_sesion")
);

-- CreateTable
CREATE TABLE "Pagos" (
    "id_pago" SERIAL NOT NULL,
    "id_sesion" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo_pago" "metodo_pago" NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_pago" "estado_pago" NOT NULL DEFAULT 'pendiente',

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "Calificaciones" (
    "id_calificacion" SERIAL NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_sesion" INTEGER NOT NULL,
    "calificacion" INTEGER,
    "comentario" TEXT,
    "fecha_calificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Calificaciones_pkey" PRIMARY KEY ("id_calificacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_correo_electronico_key" ON "Usuarios"("correo_electronico");

-- CreateIndex
CREATE UNIQUE INDEX "TutoresInfo_id_usuario_key" ON "TutoresInfo"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Materias_nombre_materia_key" ON "Materias"("nombre_materia");

-- AddForeignKey
ALTER TABLE "Roles" ADD CONSTRAINT "Roles_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "Perfiles"("id_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "Perfiles"("id_perfil") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutoresInfo" ADD CONSTRAINT "TutoresInfo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorMateria" ADD CONSTRAINT "TutorMateria_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "TutoresInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorMateria" ADD CONSTRAINT "TutorMateria_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materias"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bitacora" ADD CONSTRAINT "Bitacora_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificaciones" ADD CONSTRAINT "Notificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesiones" ADD CONSTRAINT "Sesiones_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesiones" ADD CONSTRAINT "Sesiones_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sesiones" ADD CONSTRAINT "Sesiones_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "Materias"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_id_sesion_fkey" FOREIGN KEY ("id_sesion") REFERENCES "Sesiones"("id_sesion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificaciones" ADD CONSTRAINT "Calificaciones_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificaciones" ADD CONSTRAINT "Calificaciones_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificaciones" ADD CONSTRAINT "Calificaciones_id_sesion_fkey" FOREIGN KEY ("id_sesion") REFERENCES "Sesiones"("id_sesion") ON DELETE RESTRICT ON UPDATE CASCADE;
