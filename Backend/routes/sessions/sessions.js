const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET: Bloques ocupados de un tutor
router.get("/tutores/:id/disponibilidad", async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID de tutor inválido" });
  }

  try {
    const sesiones = await prisma.sesiones.findMany({
      where: {
        id_tutor: parseInt(id),
        estado: { not: "cancelada" },
        fecha_hora: { gte: new Date() } // Solo futuras sesiones
      },
      select: { fecha_hora: true },
    });

    res.json({ bloques_ocupados: sesiones.map(s => s.fecha_hora) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener disponibilidad" });
  }
});

// POST: Crear cita
router.post("/cita", async (req, res) => {
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

module.exports = router;
