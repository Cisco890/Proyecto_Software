const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

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

// PUT: Actualizar información del tutor
router.put("/tutores/info/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;
  const {
    descripcion,
    tarifa_hora,
    experiencia,
    horario,
    modalidad,
  } = req.body;

  // Validación exhaustiva de campos requeridos
  if (!descripcion || !tarifa_hora || !experiencia || horario === undefined || !modalidad) {
    return res.status(400).json({ 
      error: "Todos los campos son obligatorios",
      campos_requeridos: ["descripcion", "tarifa_hora", "experiencia", "horario", "modalidad"]
    });
  }

  // Validación de tipos de datos
  const tarifaNum = parseFloat(tarifa_hora);
  const experienciaNum = parseInt(experiencia);
  const horarioNum = parseInt(horario);

  if (isNaN(tarifaNum) || tarifaNum <= 0) {
    return res.status(400).json({
      error: "La tarifa por hora debe ser un número válido mayor a 0"
    });
  }

  if (isNaN(experienciaNum) || experienciaNum < 0) {
    return res.status(400).json({
      error: "La experiencia debe ser un número válido no negativo"
    });
  }

  if (isNaN(horarioNum) || ![0, 1, 2].includes(horarioNum)) {
    return res.status(400).json({
      error: "Horario inválido. Debe ser 0 (mañana), 1 (tarde) o 2 (noche)"
    });
  }

  // Validación de modalidad
  const modalidadesValidas = ["virtual", "presencial", "hibrido"];
  if (!modalidadesValidas.includes(modalidad)) {
    return res.status(400).json({
      error: "Modalidad inválida. Debe ser: virtual, presencial o hibrido"
    });
  }

  try {
    // Verificar existencia del usuario
    const usuarioExistente = await prisma.usuarios.findUnique({
      where: { id_usuario: parseInt(idUsuario) },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ 
        error: "Usuario no encontrado",
        id_usuario: idUsuario
      });
    }

    // Verificar existencia de información del tutor
    const tutorExistente = await prisma.tutoresInfo.findUnique({
      where: { id_usuario: parseInt(idUsuario) },
    });

    if (!tutorExistente) {
      return res.status(404).json({ 
        error: "Información de tutor no encontrada. Utilice el endpoint POST para crear nueva información.",
        id_usuario: idUsuario
      });
    }

    // Actualizar información del tutor
    const tutorActualizado = await prisma.tutoresInfo.update({
      where: { id_usuario: parseInt(idUsuario) },
      data: {
        descripcion: descripcion.trim(),
        tarifa_hora: tarifaNum,
        experiencia: experienciaNum,
        horario: horarioNum,
        modalidad: modalidad,
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            correo: true,
            foto_perfil: true,
          }
        },
      },
    });

    res.json({
      message: "Información actualizada correctamente",
      tutor: tutorActualizado
    });

  } catch (error) {
    console.error("Error en actualización de tutor:", {
      idUsuario: idUsuario,
      error: error.message,
      stack: error.stack
    });

    // Manejo específico de errores de Prisma
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: "Registro no encontrado para actualización"
      });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: "Conflicto de datos único"
      });
    }

    res.status(500).json({ 
      error: "Error interno del servidor",
      detalle: process.env.NODE_ENV === 'development' ? error.message : 'Contacte al administrador'
    });
  }
});
//get
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

module.exports = router;
