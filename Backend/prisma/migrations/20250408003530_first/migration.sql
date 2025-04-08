-- CreateEnum
CREATE TYPE "nivelAcademico" AS ENUM ('primero', 'segundo', 'tercero', 'cuarto', 'quinto');

-- CreateEnum
CREATE TYPE "tipoNotificacion" AS ENUM ('recordatorio', 'alerta', 'mensaje', 'sistema');

-- CreateEnum
CREATE TYPE "metodoPago" AS ENUM ('tarjeta', 'efectivo', 'transferencia');

-- CreateEnum
CREATE TYPE "estadoPago" AS ENUM ('pendiente', 'completado', 'rechazado', 'cancelado');

-- CreateEnum
CREATE TYPE "estadadoSesion" AS ENUM ('pendiente', 'completada', 'en_curso', 'cancelada');

-- CreateEnum
CREATE TYPE "metodoEnsenanza" AS ENUM ('virtual', 'presencial', 'hibrido');

-- CreateEnum
CREATE TYPE "tipoUsuario" AS ENUM ('administrador', 'estudiante', 'tutor');

-- CreateTable
CREATE TABLE "administradores" (
    "id" SERIAL NOT NULL,
    "rol" VARCHAR(150) NOT NULL,
    "nivelAcceso" INTEGER NOT NULL,

    CONSTRAINT "administradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bitacora" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_evento" VARCHAR(50) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_origen" VARCHAR(45) NOT NULL,

    CONSTRAINT "bitacora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones" (
    "id_calificacion" SERIAL NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_sesion" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "fecha_calificacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("id_calificacion")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id_estudiante" SERIAL NOT NULL,
    "nivel_academico" "nivelAcademico" NOT NULL,
    "institucion" VARCHAR(100) NOT NULL DEFAULT 'Universidad del Valle de Guatemala',
    "objetivoAprendizaje" TEXT NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id_estudiante")
);

-- CreateTable
CREATE TABLE "materias" (
    "id_materia" SERIAL NOT NULL,
    "nombre_materia" VARCHAR(100) NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id_materia")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_notificacion" "tipoNotificacion" NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha_envio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id_pago" SERIAL NOT NULL,
    "id_sesion" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo_pago" "metodoPago" NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estadoPago" "estadoPago" NOT NULL DEFAULT 'pendiente',

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id_sesiones" SERIAL NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "id_estudiante" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duracion_min" INTEGER NOT NULL,
    "estado" "estadadoSesion" NOT NULL,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id_sesiones")
);

-- CreateTable
CREATE TABLE "tutor_materia" (
    "id_tutor_materia" SERIAL NOT NULL,
    "id_tutor" INTEGER NOT NULL,
    "id_materia" INTEGER NOT NULL,

    CONSTRAINT "tutor_materia_pkey" PRIMARY KEY ("id_tutor_materia")
);

-- CreateTable
CREATE TABLE "tutores" (
    "id_tutor" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tarifa_hora" DECIMAL(10,2) NOT NULL,
    "experiencia" INTEGER NOT NULL,
    "disponibilidad" INTEGER NOT NULL,
    "metodo_ensenanza" "metodoEnsenanza" NOT NULL,

    CONSTRAINT "tutores_pkey" PRIMARY KEY ("id_tutor")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "correo_electronico" VARCHAR(150) NOT NULL,
    "contrasena" TEXT NOT NULL,
    "tipo_usuario" VARCHAR(20) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "materias_nombre_materia_key" ON "materias"("nombre_materia");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_electronico_key" ON "usuarios"("correo_electronico");

-- AddForeignKey
ALTER TABLE "administradores" ADD CONSTRAINT "administradores_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "tutores"("id_tutor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_id_sesion_fkey" FOREIGN KEY ("id_sesion") REFERENCES "sesiones"("id_sesiones") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_sesion_fkey" FOREIGN KEY ("id_sesion") REFERENCES "sesiones"("id_sesiones") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "tutores"("id_tutor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "estudiantes"("id_estudiante") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "materias"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_materia" ADD CONSTRAINT "tutor_materia_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "tutores"("id_tutor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_materia" ADD CONSTRAINT "tutor_materia_id_materia_fkey" FOREIGN KEY ("id_materia") REFERENCES "materias"("id_materia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutores" ADD CONSTRAINT "tutores_id_tutor_fkey" FOREIGN KEY ("id_tutor") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
