const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");

router.post("/calificaciones", async (req, res) => {
  const { id_tutor, id_estudiante, id_sesion, calificacion, comentario } =
    req.body;

  if (!id_tutor || !id_estudiante || !id_sesion || !calificacion) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

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

    const calificacionExistente = await prisma.calificaciones.findFirst({
      where: { id_sesion: parseInt(id_sesion) },
    });

    if (calificacionExistente) {
      return res
        .status(400)
        .json({ error: "Ya existe una calificación para esta sesión" });
    }

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

module.exports = router;
