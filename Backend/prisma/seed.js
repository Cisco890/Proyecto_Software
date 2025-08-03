// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Perfiles
  await prisma.perfiles.createMany({
    data: [
      { id_perfil: 1, nombre: "Estudiante" },
      { id_perfil: 2, nombre: "Tutor" },
    ],
    skipDuplicates: true,
  });

  // Roles
  await prisma.roles.createMany({
    data: [
      {
        descripcion: "Acceso a cursos",
        funcion: "Accede a contenido del curso",
        id_perfil: 1,
      },
      {
        descripcion: "Gestionar sesiones",
        funcion: "Puede ofrecer tutorías",
        id_perfil: 2,
      },
    ],
    skipDuplicates: true,
  });

  // Usuarios
  await prisma.usuarios.createMany({
    data: [
      {
        id_usuario: 1,
        nombre: "Laura Sánchez",
        correo: "laura@example.com",
        contrasena: "pass123",
        telefono: "1111111111",
        id_perfil: 1,
        foto_perfil: null,
      },
      {
        id_usuario: 2,
        nombre: "Miguel Torres",
        correo: "miguel@example.com",
        contrasena: "pass123",
        telefono: "2222222222",
        id_perfil: 1,
        foto_perfil: null,
      },
      {
        id_usuario: 3,
        nombre: "Elena Ramírez",
        correo: "elena@example.com",
        contrasena: "pass123",
        telefono: "3333333333",
        id_perfil: 1,
        foto_perfil: null,
      },
      {
        id_usuario: 4,
        nombre: "Carlos Pérez",
        correo: "carlos@example.com",
        contrasena: "pass123",
        telefono: "4444444444",
        id_perfil: 1,
        foto_perfil: null,
      },
      {
        id_usuario: 5,
        nombre: "Valeria Díaz",
        correo: "valeria@example.com",
        contrasena: "pass123",
        telefono: "5555555555",
        id_perfil: 1,
        foto_perfil: null,
      },
      {
        id_usuario: 6,
        nombre: "Ana Tutor",
        correo: "ana.tutor@example.com",
        contrasena: "pass123",
        telefono: "6666666666",
        id_perfil: 2,
        foto_perfil: null,
      },
      {
        id_usuario: 7,
        nombre: "Jorge Tutor",
        correo: "jorge.tutor@example.com",
        contrasena: "pass123",
        telefono: "7777777777",
        id_perfil: 2,
        foto_perfil: null,
      },
      {
        id_usuario: 8,
        nombre: "Lucía Tutor",
        correo: "lucia.tutor@example.com",
        contrasena: "pass123",
        telefono: "8888888888",
        id_perfil: 2,
        foto_perfil: null,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.tutoresInfo.createMany({
    data: [
      {
        id: 1,
        id_usuario: 6,
        descripcion: "Tutor de Matemáticas",
        tarifa_hora: 200.0,
        experiencia: 4,
        modalidad: "virtual",
      },
      {
        id: 2,
        id_usuario: 7,
        descripcion: "Tutor de Física",
        tarifa_hora: 250.0,
        experiencia: 6,
        modalidad: "presencial",
      },
      {
        id: 3,
        id_usuario: 8,
        descripcion: "Tutor de Programación",
        tarifa_hora: 300.0,
        experiencia: 3,
        modalidad: "hibrido",
      },
    ],
    skipDuplicates: true,
  });

  // Materias
  await prisma.materias.createMany({
    data: [
      { id_materia: 1, nombre_materia: "Matemáticas" },
      { id_materia: 2, nombre_materia: "Física" },
      { id_materia: 3, nombre_materia: "Programación" },
      { id_materia: 4, nombre_materia: "Química" },
    ],
    skipDuplicates: true,
  });

  // Tutor-Materia
  await prisma.tutorMateria.createMany({
    data: [
      { id_tutor_materia: 1, id_tutor: 1, id_materia: 1 },
      { id_tutor_materia: 2, id_tutor: 2, id_materia: 2 },
      { id_tutor_materia: 3, id_tutor: 3, id_materia: 3 },
      { id_tutor_materia: 4, id_tutor: 1, id_materia: 4 },
      { id_tutor_materia: 5, id_tutor: 2, id_materia: 1 },
    ],
    skipDuplicates: true,
  });

  // Sesiones
  const now = new Date();
  await prisma.sesiones.createMany({
    data: [
      {
        id_sesion: 1,
        id_tutor: 6,
        id_estudiante: 1,
        id_materia: 1,
        fecha_hora: new Date(now.getTime() - 10 * 86400000),
        duracion_min: 60,
        estado: "completada",
      },
      {
        id_sesion: 2,
        id_tutor: 7,
        id_estudiante: 2,
        id_materia: 2,
        fecha_hora: new Date(now.getTime() - 8 * 86400000),
        duracion_min: 90,
        estado: "completada",
      },
      {
        id_sesion: 3,
        id_tutor: 8,
        id_estudiante: 3,
        id_materia: 3,
        fecha_hora: new Date(now.getTime() - 6 * 86400000),
        duracion_min: 45,
        estado: "completada",
      },
      {
        id_sesion: 4,
        id_tutor: 6,
        id_estudiante: 4,
        id_materia: 4,
        fecha_hora: new Date(now.getTime() - 3 * 86400000),
        duracion_min: 60,
        estado: "cancelada",
      },
      {
        id_sesion: 5,
        id_tutor: 7,
        id_estudiante: 5,
        id_materia: 1,
        fecha_hora: new Date(now.getTime() + 2 * 86400000),
        duracion_min: 60,
        estado: "pendiente",
      },
      {
        id_sesion: 6,
        id_tutor: 8,
        id_estudiante: 1,
        id_materia: 3,
        fecha_hora: new Date(now.getTime() + 4 * 86400000),
        duracion_min: 75,
        estado: "pendiente",
      },
    ],
    skipDuplicates: true,
  });

  // Pagos
  await prisma.pagos.createMany({
    data: [
      {
        id_pago: 1,
        id_sesion: 1,
        monto: 200.0,
        metodo_pago: "transferencia",
        estado_pago: "completado",
      },
      {
        id_pago: 2,
        id_sesion: 2,
        monto: 250.0,
        metodo_pago: "tarjeta",
        estado_pago: "completado",
      },
      {
        id_pago: 3,
        id_sesion: 3,
        monto: 300.0,
        metodo_pago: "efectivo",
        estado_pago: "completado",
      },
    ],
    skipDuplicates: true,
  });

  // Calificaciones
  await prisma.calificaciones.createMany({
    data: [
      {
        id_calificacion: 1,
        id_tutor: 6,
        id_estudiante: 1,
        id_sesion: 1,
        calificacion: 5,
        comentario: "Excelente tutor",
      },
      {
        id_calificacion: 2,
        id_tutor: 7,
        id_estudiante: 2,
        id_sesion: 2,
        calificacion: 4,
        comentario: "Muy claro en la explicación",
      },
      {
        id_calificacion: 3,
        id_tutor: 8,
        id_estudiante: 3,
        id_sesion: 3,
        calificacion: 5,
        comentario: "Muy buena clase",
      },
    ],
    skipDuplicates: true,
  });

  // Bitácora
  await prisma.bitacora.createMany({
    data: [
      {
        id: 1,
        id_usuario: 1,
        tipo_evento: "inicio_sesion",
        descripcion: "El usuario inició sesión",
        ip_origen: "192.168.1.1",
      },
      {
        id: 2,
        id_usuario: 2,
        tipo_evento: "registro",
        descripcion: "El usuario se registró en el sistema",
        ip_origen: "192.168.1.2",
      },
      {
        id: 3,
        id_usuario: 6,
        tipo_evento: "inicio_sesion",
        descripcion: "El tutor inició sesión",
        ip_origen: "192.168.1.3",
      },
    ],
    skipDuplicates: true,
  });

  // Notificaciones
  await prisma.notificaciones.createMany({
    data: [
      {
        id_notificacion: 1,
        id_usuario: 1,
        tipo_notificacion: "recordatorio",
        mensaje: "Tienes una sesión próxima en dos días",
      },
      {
        id_notificacion: 2,
        id_usuario: 2,
        tipo_notificacion: "alerta",
        mensaje: "Tu sesión fue cancelada",
      },
      {
        id_notificacion: 3,
        id_usuario: 6,
        tipo_notificacion: "mensaje",
        mensaje: "Un estudiante te calificó",
      },
    ],
    skipDuplicates: true,
  });
}

// sincronizar secuencia de sesiones (PostgreSQL)
await prisma.$executeRaw`SELECT setval('"Sesiones_id_sesion_seq"', (SELECT MAX(id_sesion) FROM "Sesiones"))`;

await main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
