const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  const { id_tutor, id_estudiante, id_materia, fecha_hora, duracion_min } =
    req.body;

  if (!id_tutor || !id_estudiante || !id_materia || !fecha_hora) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const nuevaSesion = await prisma.sesiones.create({
      data: {
        id_tutor: parseInt(id_tutor),
        id_estudiante: parseInt(id_estudiante),
        id_materia: parseInt(id_materia),
        fecha_hora: new Date(fecha_hora),
        duracion_min: duracion_min ? parseInt(duracion_min) : null,
        estado: "pendiente",
      },
    });

    res.status(201).json(nuevaSesion);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al crear la sesión" });
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

module.exports = router;
