const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//Metodo Get de todos los usuarios (tutores)
router.get("/", async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      where: {
        id_perfil: 2,
      },
      include: {
        tutorInfo: {
          include: {
            tutorMaterias: {
              include: {
                materia: true,
              },
            },
          },
        },
      },
    });
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /usuarios/estudiantes
router.get("/usuarios/estudiantes", async (req, res) => {
  try {
    const estudiantes = await prisma.usuarios.findMany({
      where: {
        id_perfil: 1,
      },
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        telefono: true,
        foto_perfil: true,
      },
    });

    res.json(estudiantes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Metodo Post De registrar usuario
router.post("/registro", async (req, res) => {
  const { nombre, correo, contrasena, tipo_usuario, telefono } = req.body;

  if (!nombre || !correo || !contrasena || !telefono) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  } else if (!correo.includes("@")) {
    return res.status(400).json({ error: "El correo debe ser válido" });
  }

  try {
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        correo,
        contrasena,
        id_perfil: tipo_usuario === "tutor" ? 2 : 1,
        telefono,
        foto_perfil: "null",
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//metodo post para los perfiles
router.post("/perfiles", async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res
      .status(400)
      .json({ error: "El nombre del perfil es obligatorio" });
  }

  try {
    const nuevoPerfil = await prisma.perfiles.create({
      data: {
        nombre,
      },
    });

    res.status(201).json(nuevoPerfil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el perfil" });
  }
});

//Metodo Post para LOGIN de Usuarios
router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: {
        correo: correo,
      },
    });

    if (!usuario || usuario.contrasena !== contrasena) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res
      .status(200)
      .json({ message: "Inicio de sesión exitoso", user: usuario });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Metodo get para obtener el raiting del tutor
router.get("/tutores/:id/rating", async (req, res) => {
  const { id } = req.params;

  try {
    const calificaciones = await prisma.calificaciones.findMany({
      where: {
        id_tutor: parseInt(id),
        calificacion: {
          not: null,
        },
      },
      select: {
        calificacion: true,
      },
    });

    if (calificaciones.length === 0) {
      return res.json({
        rating_promedio: 0,
        total_calificaciones: 0,
        message: "Este tutor aún no tiene calificaciones",
      });
    }

    // Calcular promedio
    const suma = calificaciones.reduce(
      (acc, curr) => acc + curr.calificacion,
      0
    );
    const promedio = suma / calificaciones.length;

    res.json({
      rating_promedio: promedio,
      total_calificaciones: calificaciones.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Endpoint GET para obtener la información del tutor
// Endpoint GET para obtener la información del tutor por ID de USUARIO
router.get("/tutores/info/usuario/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const tutorInfo = await prisma.tutoresInfo.findUnique({
      where: {
        id_usuario: parseInt(idUsuario),
      },
      include: {
        usuario: true,
        tutorMaterias: {
          include: {
            materia: true,
          },
        },
      },
    });

    if (!tutorInfo) {
      return res.status(404).json({ error: "Tutor no encontrado" });
    }

    const calificaciones = await prisma.calificaciones.findMany({
      where: {
        id_tutor: tutorInfo.id_usuario,
        calificacion: {
          not: null,
        },
      },
    });

    const rating_promedio =
      calificaciones.length > 0
        ? calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0) /
          calificaciones.length
        : 0;

    const response = {
      id_tutor: tutorInfo.id,
      id_usuario: tutorInfo.id_usuario,
      nombre: tutorInfo.usuario.nombre,
      foto_perfil: tutorInfo.usuario.foto_perfil,
      descripcion: tutorInfo.descripcion,
      horario: tutorInfo.horario,
      modalidad: tutorInfo.modalidad,
      experiencia: tutorInfo.experiencia,
      tarifa_hora: tutorInfo.tarifa_hora,
      materias: tutorInfo.tutorMaterias.map((tm) => ({
        id_materia: tm.materia.id_materia,
        nombre_materia: tm.materia.nombre_materia,
      })),
      rating_promedio: parseFloat(rating_promedio.toFixed(2)),
      total_calificaciones: calificaciones.length,
      comentarios: calificaciones
        .filter((c) => c.comentario)
        .map((c) => ({
          calificacion: c.calificacion,
          comentario: c.comentario,
          fecha: c.fecha_calificacion,
        })),
    };

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Endpoint para obtener la metodología del tutor
router.get("/tutores/:id/metodologia", async (req, res) => {
  const { id } = req.params;

  try {
    const tutorInfo = await prisma.tutoresInfo.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        metodologia: true,
      },
    });

    if (!tutorInfo) {
      return res.status(404).json({ error: "Tutor no encontrado" });
    }

    res.json({
      metodologia:
        tutorInfo.metodologia || "No se ha especificado una metodología",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Endpoint para obtener la tutoría que da el tutor
router.get("/tutores/:id/tutorias", async (req, res) => {
  const { id } = req.params;

  try {
    const tutorMaterias = await prisma.tutorMaterias.findMany({
      where: {
        id_tutor: parseInt(id),
      },
      include: {
        materia: true,
        tutor: {
          include: {
            usuario: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!tutorMaterias || tutorMaterias.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron tutorías para este tutor" });
    }

    const tutorias = tutorMaterias.map((tm) => ({
      materia: tm.materia.nombre_materia,
      tutor: tm.tutor.usuario.nombre,
      horario: tm.tutor.horario,
      modalidad: tm.tutor.modalidad,
    }));

    res.json(tutorias);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Endpoint para obtener la descripción del tutor
router.get("/tutores/:id/descripcion", async (req, res) => {
  const { id } = req.params;

  try {
    const tutorInfo = await prisma.tutoresInfo.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        descripcion: true,
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
    });

    if (!tutorInfo) {
      return res.status(404).json({ error: "Tutor no encontrado" });
    }

    res.json({
      nombre: tutorInfo.usuario.nombre,
      descripcion:
        tutorInfo.descripcion || "No se ha proporcionado una descripción",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//POST para agregar info del tutor
router.post("/tutores/info", async (req, res) => {
  const {
    id_usuario,
    descripcion,
    tarifa_hora,
    experiencia,
    horario,
    modalidad,
  } = req.body;

  if (
    !id_usuario ||
    !descripcion ||
    !tarifa_hora ||
    !experiencia ||
    horario === undefined ||
    !modalidad
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const horarioNum = parseInt(horario);
  if (![0, 1, 2].includes(horarioNum)) {
    return res.status(400).json({
      error: "Horario inválido. Debe ser 0 (mañana), 1 (tarde) o 2 (noche)",
    });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id_usuario) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const tutorExistente = await prisma.tutoresInfo.findUnique({
      where: { id_usuario: parseInt(id_usuario) },
    });

    if (tutorExistente) {
      return res
        .status(400)
        .json({ error: "Este usuario ya tiene información de tutor" });
    }

    const nuevoTutor = await prisma.tutoresInfo.create({
      data: {
        id_usuario: parseInt(id_usuario),
        descripcion,
        tarifa_hora: parseFloat(tarifa_hora),
        experiencia: parseInt(experiencia),
        horario: horarioNum,
        modalidad,
      },
      include: {
        usuario: true,
      },
    });

    res.status(201).json(nuevoTutor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//PUT para modificar la información de tutores
router.put("/tutores/info/:id", async (req, res) => {
  const { id } = req.params;
  const { descripcion, tarifa_hora, experiencia, horario, modalidad } =
    req.body;

  try {
    const tutorInfo = await prisma.tutoresInfo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tutorInfo) {
      return res.status(404).json({ error: "Información no encontrada" });
    }

    let horarioValidado = tutorInfo.horario;
    if (horario !== undefined) {
      const horarioNum = parseInt(horario);
      if (![0, 1, 2].includes(horarioNum)) {
        return res
          .status(400)
          .json({ error: "Horario inválido. Debe ser 0, 1 o 2" });
      }
      horarioValidado = horarioNum;
    }

    const tutorActualizado = await prisma.tutoresInfo.update({
      where: { id: parseInt(id) },
      data: {
        descripcion: descripcion || tutorInfo.descripcion,
        tarifa_hora: tarifa_hora
          ? parseFloat(tarifa_hora)
          : tutorInfo.tarifa_hora,
        experiencia: experiencia
          ? parseInt(experiencia)
          : tutorInfo.experiencia,
        horario: horarioValidado,
        modalidad: modalidad || tutorInfo.modalidad,
      },
      include: {
        usuario: true,
      },
    });

    res.json(tutorActualizado);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

router.post("/calificaciones", async (req, res) => {
  const { id_tutor, id_estudiante, id_sesion, calificacion, comentario } =
    req.body;

  if (!id_tutor || !id_estudiante || !id_sesion || !calificacion) {
    return res.status(400).json({ error: "" });
  }
  //Validaciones
  try {
    const sesion = await prisma.sesiones.findUnique({
      where: { id_sesion: parseInt(id_sesion) },
    });

    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    const tutor = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id_tutor) },
    });

    const estudiante = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id_estudiante) },
    });

    if (!tutor || !estudiante) {
      return res
        .status(404)
        .json({ error: "Tutor o estudiante no encontrado" });
    }

    // Si existe la calificación no entra
    const calificacionExistente = await prisma.calificaciones.findFirst({
      where: { id_sesion: parseInt(id_sesion) },
    });

    if (calificacionExistente) {
      return res
        .status(400)
        .json({ error: "Ya existe una calificación para esta sesión" });
    }

    //Insert
    const nuevaCalificacion = await prisma.calificaciones.create({
      data: {
        id_tutor: parseInt(id_tutor),
        id_estudiante: parseInt(id_estudiante),
        id_sesion: parseInt(id_sesion),
        calificacion: parseInt(calificacion),
        comentario: comentario || null,
      },
      include: {
        tutor: true,
        estudiante: true,
        sesion: true,
      },
    });

    res.status(201).json(nuevaCalificacion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// GET /tutores/:id/sesiones
router.get("/tutores/:id/sesiones", async (req, res) => {
  const { id } = req.params;

  try {
    const sesiones = await prisma.sesiones.findMany({
      where: {
        id_tutor: parseInt(id),
      },
      include: {
        estudiante: {
          select: {
            nombre: true,
          },
        },
        materia: {
          select: {
            nombre_materia: true,
          },
        },
        tutor: {
          include: {
            tutorInfo: true,
          },
        },
      },
    });

    const resultado = sesiones.map((s) => ({
      materia: s.materia.nombre_materia,
      estudiante: s.estudiante.nombre,
      modalidad: s.tutor.tutorInfo?.modalidad || "No definida",
      horario: s.tutor.tutorInfo?.horario ?? "Sin horario",
    }));

    res.json(resultado);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Subir bitacora
router.post("/bitacora", async (req, res) => {
  const { id_usuario, tipo_evento, descripcion, ip_origen } = req.body;

  if (!id_usuario || !tipo_evento || !descripcion || !ip_origen) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  //Validación de usuario
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id_usuario) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    //Datos
    const nuevaBitacora = await prisma.bitacora.create({
      data: {
        id_usuario: parseInt(id_usuario),
        tipo_evento,
        descripcion,
        ip_origen,
      },
      include: {
        usuario: true,
      },
    });

    res.status(201).json(nuevaBitacora);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Modificar tutor foto
router.put("/usuarios/:id/foto", async (req, res) => {
  const { id } = req.params;
  const { foto_perfil } = req.body;

  if (!foto_perfil) {
    return res.status(400).json({ error: "La URL de la foto es obligatoria" });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuarioActualizado = await prisma.usuarios.update({
      where: { id_usuario: parseInt(id) },
      data: {
        foto_perfil: foto_perfil,
      },
    });
    res.json(usuarioActualizado);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Delete de usuarios
router.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Usuario validación
    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(id) },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Elimina  todo lo relacionado al tutor
    if (usuario.id_perfil === 2) {
      await prisma.tutoresInfo.deleteMany({
        where: { id_usuario: parseInt(id) },
      });
    }

    // Delete
    await prisma.usuarios.delete({
      where: { id_usuario: parseInt(id) },
    });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Eliminar bitacoras
router.delete("/bitacora/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const bitacora = await prisma.bitacora.findUnique({
      where: { id: parseInt(id) },
    });

    if (!bitacora) {
      return res.status(404).json({ error: "Bitácora no encontrada" });
    }
    await prisma.bitacora.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Bitácora eliminada correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Modificar calificaciones
router.put("/calificaciones/:id", async (req, res) => {
  const { id } = req.params;
  const { calificacion, comentario } = req.body;

  try {
    const actualizada = await prisma.calificaciones.update({
      where: { id_calificacion: parseInt(id) },
      data: {
        calificacion: calificacion ? parseInt(calificacion) : undefined,
        comentario: comentario || undefined,
        fecha_calificacion: new Date(),
      },
    });

    res.json(actualizada);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Modificar horario
router.post("/tutores/:id/horario", async (req, res) => {
  const { id } = req.params;
  const { horario } = req.body;

  try {
    const actualizado = await prisma.tutoresInfo.update({
      where: { id_usuario: parseInt(id) },
      data: {
        horario: horario ? parseInt(horario) : null,
      },
    });

    res.json(actualizado);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Modificar horario del tutor
router.put("/tutores/:id/horario", async (req, res) => {
  const { id } = req.params;
  const { horario } = req.body;

  try {
    const tutor = await prisma.tutoresInfo.findUnique({
      where: { id_usuario: parseInt(id) },
    });

    if (!tutor) {
      return res.status(404).json({ error: "Tutor no encontrado" });
    }

    const actualizado = await prisma.tutoresInfo.update({
      where: { id_usuario: parseInt(id) },
      data: { horario: parseInt(horario) },
    });

    res.json(actualizado);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Eliminar horarios de los tutores inactivos
router.delete("/tutores/horarios/inactivos", async (req, res) => {
  try {
    const result = await prisma.tutoresInfo.deleteMany({
      where: { horario: null },
    });

    res.json({ message: `${result.count} horarios eliminados` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Eliminar tutores retirados
router.delete("/tutores/retirados", async (req, res) => {
  try {
    const retirados = await prisma.usuarios.findMany({
      where: {
        id_perfil: 2,
        tutorInfo: null,
      },
    });

    const ids = retirados.map((u) => u.id_usuario);

    await prisma.usuarios.deleteMany({
      where: {
        id_usuario: { in: ids },
      },
    });

    res.json({ message: `${ids.length} tutores retirados eliminados` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
