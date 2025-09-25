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

// GET: Obtener todas las citas de un usuario (tutor o estudiante)
router.get("/citas/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;

  if (!idUsuario || isNaN(idUsuario)) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    const citas = await prisma.sesiones.findMany({
      where: {
        OR: [
          { id_tutor: parseInt(idUsuario) },
          { id_estudiante: parseInt(idUsuario) }
        ]
      },
      include: {
        tutor: {
          select: {
            id_usuario: true,
            nombre: true,
            foto_perfil: true
          }
        },
        estudiante: {
          select: {
            id_usuario: true,
            nombre: true,
            foto_perfil: true
          }
        },
        materia: {
          select: {
            id_materia: true,
            nombre_materia: true
          }
        },
        pagos: true,
        calificaciones: true
      },
      orderBy: {
        fecha_hora: 'asc'
      }
    });

    res.json(citas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las citas" });
  }
});

// GET: Obtener cita específica por ID
router.get("/cita/:idSesion", async (req, res) => {
  const { idSesion } = req.params;

  if (!idSesion || isNaN(idSesion)) {
    return res.status(400).json({ error: "ID de sesión inválido" });
  }

  try {
    const cita = await prisma.sesiones.findUnique({
      where: {
        id_sesion: parseInt(idSesion)
      },
      include: {
        tutor: {
          select: {
            id_usuario: true,
            nombre: true,
            foto_perfil: true,
            tutorInfo: true
          }
        },
        estudiante: {
          select: {
            id_usuario: true,
            nombre: true,
            foto_perfil: true
          }
        },
        materia: {
          select: {
            id_materia: true,
            nombre_materia: true
          }
        },
        pagos: true,
        calificaciones: true
      }
    });

    if (!cita) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.json(cita);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la cita" });
  }
});

module.exports = router;
