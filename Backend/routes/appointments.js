const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

// GET: Bloques ocupados de un tutor
router.get("/disponibilidad/:idTutor", async (req, res) => {
  const { idTutor } = req.params;

  try {
    const sesiones = await prisma.sesiones.findMany({
      where: {
        id_tutor: parseInt(idTutor),
        estado: { not: "cancelada" },
      },
      select: {
        fecha_hora: true,
      },
    });

    const bloquesOcupados = sesiones.map((s) => s.fecha_hora);

    res.json({ bloques_ocupados: bloquesOcupados });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ error: "Error al obtener disponibilidad del tutor" });
  }
});

// POST: Crear cita
router.post("/", async (req, res) => {
  const { id_tutor, id_estudiante, id_materia, fecha_hora, duracion_min } = req.body;


  if (!id_tutor || !id_estudiante || !id_materia || !fecha_hora) {
    return res.status(400).json({ 
      error: "Faltan campos requeridos",
      datos_recibidos: req.body 
    });
  }

  try {
    //Verificar si ya existe una cita en ese horario
    const fechaHoraCita = new Date(fecha_hora);
    
    const citaExistente = await prisma.sesiones.findFirst({
      where: {
        id_tutor: parseInt(id_tutor),
        fecha_hora: fechaHoraCita,
        estado: {
          not: "cancelada" // No considerar citas canceladas
        }
      }
    });

    if (citaExistente) {
      return res.status(409).json({ 
        error: "El tutor ya tiene una cita programada en este horario",
        cita_existente: citaExistente
      });
    }

    //VALIDACIÓN ADICIONAL: Evitar que un estudiante agende múltiples citas a la misma hora
    const citaEstudianteExistente = await prisma.sesiones.findFirst({
      where: {
        id_estudiante: parseInt(id_estudiante),
        fecha_hora: fechaHoraCita,
        estado: {
          not: "cancelada"
        }
      }
    });

    if (citaEstudianteExistente) {
      return res.status(409).json({ 
        error: "Ya tienes una cita programada en este horario"
      });
    }

    // Crear la cita si pasa todas las validaciones
    const nuevaSesion = await prisma.sesiones.create({
      data: {
        id_tutor: parseInt(id_tutor),
        id_estudiante: parseInt(id_estudiante),
        id_materia: parseInt(id_materia),
        fecha_hora: fechaHoraCita,
        duracion_min: duracion_min ? parseInt(duracion_min) : null,
        estado: "pendiente",
      },
    });

    console.log("Cita creada exitosamente:", nuevaSesion);
    
    res.status(201).json(nuevaSesion);
  } catch (err) {
    console.error("Error detallado al crear sesión:", err.message);
    res.status(500).json({ 
      error: "Error al crear la sesión",
      detalle: err.message 
    });
  }
});


// GET: sesiones por usuario (tutor o estudiante) con filtros básicos
router.get("/usuarios/:id/sesiones", async (req, res) => {
  const { id } = req.params;
  const { rol = "estudiante", estado, futuras } = req.query;

  try {
    const where = {};
    if (rol === "tutor") where.id_tutor = parseInt(id);
    else where.id_estudiante = parseInt(id);

    if (estado) where.estado = estado;
    if (futuras === "true") where.fecha_hora = { gte: new Date() };

    const sesiones = await prisma.sesiones.findMany({
      where,
      orderBy: { fecha_hora: "asc" },
      include: {
        estudiante: { select: { id_usuario: true, nombre: true } },
        tutor:      { select: { id_usuario: true, nombre: true } },
        materia:    { select: { id_materia: true, nombre_materia: true } },
      },
    });

    res.json(sesiones);
  } catch (err) {
    console.error("Error al obtener sesiones:", err);
    res.status(500).json({ error: "Error al obtener sesiones" });
  }
});

router.put("/sesiones/:idSesion/estado", async (req, res) => {
  const { idSesion } = req.params;
  const { estado } = req.body;

  const estadosValidos = ["pendiente", "completada", "en_curso", "cancelada"];
  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({
      error: `Estado inválido. Debe ser uno de: ${estadosValidos.join(", ")}`,
    });
  }

  try {
    const sesion = await prisma.sesiones.findUnique({
      where: { id_sesion: parseInt(idSesion) },
    });

    if (!sesion) {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }

    const sesionActualizada = await prisma.sesiones.update({
      where: { id_sesion: parseInt(idSesion) },
      data: { estado },
      include: {
        estudiante: { select: { id_usuario: true, nombre: true } },
        tutor: { select: { id_usuario: true, nombre: true } },
        materia: { select: { id_materia: true, nombre_materia: true } },
      },
    });

    res.json(sesionActualizada);
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ error: "Error al actualizar estado de la sesión" });
  }
});

module.exports = router;
