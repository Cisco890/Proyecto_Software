const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(
  process.env.SECRET_KEY || "clave_super_secreta",
  "salt",
  32
);

function decrypt(encrypted) {
  if (!encrypted) return "";
  const [ivHex, encryptedText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function desencriptarUsuario(usuario) {
  if (!usuario) return usuario;
  return {
    ...usuario,
    correo: usuario.correo ? decrypt(usuario.correo) : "",
    telefono: usuario.telefono ? decrypt(usuario.telefono) : "",
  };
}

//Metodo Get de los datos de los usuarios
router.get("/nombre", async (req, res) => {
  try {
    const nombres = await prisma.usuarios.findMany({});
    res.json(nombres.map(desencriptarUsuario));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});


// Obtener todos los tutores
router.get("/tutores", async (req, res) => {
  try {
    const tutores = await prisma.usuarios.findMany({
      where: {
        tutorInfo: {
          isNot: null 
        }
      },
      include: {
        tutorInfo: true
      }
    });

    res.json(tutores.map(desencriptarUsuario));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor al obtener tutores");
  }
});

// Obtener todos los estudiantes
router.get("/estudiantes", async (req, res) => {
  try {
    const estudiantes = await prisma.usuarios.findMany({
      where: {
        tutorInfo: null
      }
    });

    res.json(estudiantes.map(desencriptarUsuario));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor al obtener estudiantes");
  }
});



// Filtro de horarios (vespertino, matutino, nocturno)
router.get("/horarios/:horario", async (req, res) => {
  const { horario } = req.params;

  try {
    const tutores = await prisma.tutorMateria.findMany({
      where: {
        horario: horario,
      },
      include: {
        tutor: {
          include: {
            usuario: true,
          },
        },
        materia: true,
      },
    });

    res.json(
      tutores.map((tm) => ({
        ...tm.tutor,
        usuario: desencriptarUsuario(tm.tutor.usuario),
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// EndPoint tutores por experiencia
router.get("/tutores/experiencia", async (req, res) => {
  const { minExperiencia } = req.query;

  if (!minExperiencia || isNaN(minExperiencia)) {
    return res.status(400).json({
      error: "Debe proporcionar un valor mínimo de experiencia válido",
    });
  }

  try {
    const tutores = await prisma.tutoresInfo.findMany({
      where: {
        experiencia: {
          gte: parseInt(minExperiencia),
        },
      },
      include: {
        usuario: true,
      },
    });

    res.json(
      tutores.map((t) => ({
        ...t,
        usuario: desencriptarUsuario(t.usuario),
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// EndPoint filtro por materia
router.get("/tutores/materia/:idMateria", async (req, res) => {
  const { idMateria } = req.params;

  try {
    const tutores = await prisma.tutorMateria.findMany({
      where: {
        id_materia: parseInt(idMateria),
      },
      include: {
        tutor: {
          include: {
            usuario: true,
          },
        },
        materia: true,
      },
    });

    res.json(
      tutores.map((tm) => ({
        ...tm.tutor,
        usuario: desencriptarUsuario(tm.tutor.usuario),
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Filtro por modalidad
router.get("/tutores/modalidad/:modalidad", async (req, res) => {
  const { modalidad } = req.params;

  try {
    const tutores = await prisma.tutoresInfo.findMany({
      where: {
        modalidad: modalidad, // 'virtual', 'presencial' o 'hibrido'
      },
      include: {
        usuario: true,
      },
    });

    res.json(
      tutores.map((t) => ({
        ...t,
        usuario: desencriptarUsuario(t.usuario),
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Filtro por horario
router.get("/tutores/horario/:hora", async (req, res) => {
  const { hora } = req.params;

  if (!hora || isNaN(hora)) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar una hora válida (0-23)" });
  }

  try {
    const tutores = await prisma.tutoresInfo.findMany({
      where: {
        horario: parseInt(hora),
      },
      include: {
        usuario: true,
      },
    });

    res.json(
      tutores.map((t) => ({
        ...t,
        usuario: desencriptarUsuario(t.usuario),
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Filtro por precio
router.get("/tutores/precio", async (req, res) => {
  const { maxPrecio } = req.query;

  if (!maxPrecio || isNaN(maxPrecio)) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar un precio máximo válido" });
  }

  try {
    const tutores = await prisma.tutoresInfo.findMany({
      where: {
        tarifa_hora: {
          lte: parseFloat(maxPrecio),
        },
      },
      include: {
        usuario: true,
      },
    });

    res.json(
      tutores.map((t) => ({
        ...t,
        usuario: desencriptarUsuario(t.usuario),
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Endo point que filtre por raiting.
// /api/tutorias/tutores/rating?minRating=4.0
router.get("/tutores/rating", async (req, res) => {
  const { minRating } = req.query;

  if (!minRating || isNaN(minRating)) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar un rating mínimo válido" });
  }

  try {
    const resultados = await prisma.calificaciones.groupBy({
      by: ["id_tutor"],
      _avg: {
        calificacion: true,
      },
      having: {
        calificacion: {
          _avg: {
            gte: parseFloat(minRating),
          },
        },
      },
    });

    // Obtener IDs de tutores filtrados
    const tutorIds = resultados.map((r) => r.id_tutor);

    const tutores = await prisma.usuarios.findMany({
      where: {
        id_usuario: { in: tutorIds },
      },
      include: {
        tutorInfo: true,
      },
    });

    res.json(tutores.map(desencriptarUsuario));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});
// /api/tutorias/tutores/nombre?busqueda=ana
// Filtro para buscar tutores por nombre
router.get("/tutores/nombre", async (req, res) => {
  const { busqueda } = req.query;

  if (!busqueda) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar un texto de búsqueda" });
  }

  try {
    const tutores = await prisma.usuarios.findMany({
      where: {
        nombre: {
          contains: busqueda,
          mode: "insensitive", // para búsqueda sin importar mayúsculas
        },
        tutorInfo: {
          // aseguramos que es tutor
          isNot: null,
        },
      },
      include: {
        tutorInfo: true,
      },
    });

    res.json(tutores.map(desencriptarUsuario));
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Filtros avanzados
router.get("/tutores/busqueda-avanzada", async (req, res) => {
  try {
    const {
      nombre,
      materia,
      minRating,
      maxPrecio,
      minExperiencia,
      modalidad,
      horario,
    } = req.query;

    //Filtro por rating
    let tutoresFiltradosPorRating = [];
    if (minRating) {
      const resultadosRating = await prisma.calificaciones.groupBy({
        by: ["id_tutor"],
        _avg: {
          calificacion: true,
        },
        having: {
          calificacion: {
            _avg: {
              gte: parseFloat(minRating),
            },
          },
        },
      });
      tutoresFiltradosPorRating = resultadosRating.map((r) => r.id_tutor);
    }

    // Construir filtros
    const whereClause = {
      AND: [
        { id_perfil: 2 },
        nombre
          ? {
              nombre: {
                contains: nombre,
                mode: "insensitive",
              },
            }
          : {},
        minExperiencia
          ? {
              tutorInfo: {
                experiencia: {
                  gte: parseInt(minExperiencia),
                },
              },
            }
          : {},
        maxPrecio
          ? {
              tutorInfo: {
                tarifa_hora: {
                  lte: parseFloat(maxPrecio),
                },
              },
            }
          : {},
        modalidad
          ? {
              tutorInfo: {
                modalidad: modalidad,
              },
            }
          : {},
        horario
          ? {
              tutorInfo: {
                horario: horario,
              },
            }
          : {},
        minRating && tutoresFiltradosPorRating.length > 0
          ? {
              id_usuario: { in: tutoresFiltradosPorRating },
            }
          : {},
      ],
    };

    // Main
    let tutores = await prisma.usuarios.findMany({
      where: whereClause,
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

    // Optimización
    if (materia) {
      const idMateria = parseInt(materia);
      tutores = tutores.filter((tutor) =>
        tutor.tutorInfo?.tutorMaterias?.some(
          (tm) => tm.materia.id_materia === idMateria
        )
      );
    }

    // Rating promedio
    const tutoresConRating = await Promise.all(
      tutores.map(async (tutor) => {
        const calificaciones = await prisma.calificaciones.findMany({
          where: {
            id_tutor: tutor.id_usuario,
          },
          select: {
            calificacion: true,
          },
        });

        const ratingPromedio =
          calificaciones.length > 0
            ? calificaciones.reduce((sum, c) => sum + c.calificacion, 0) /
              calificaciones.length
            : 0;

        return {
          ...desencriptarUsuario(tutor),
          ratingPromedio: parseFloat(ratingPromedio.toFixed(2)),
          totalCalificaciones: calificaciones.length,
        };
      })
    );

    tutoresConRating.sort((a, b) => b.ratingPromedio - a.ratingPromedio);

    res.json(tutoresConRating);
  } catch (err) {
    console.error("Error en búsqueda avanzada:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Filtro combinado por experiencia mínima y modalidad
router.get("/tutores", async (req, res) => {
  const { minExperiencia, modalidad } = req.query;

  if ((!minExperiencia || isNaN(minExperiencia)) && !modalidad) {
    return res.status(400).json({
      error: "Debe proporcionar al menos minExperiencia (número) o modalidad.",
    });
  }

  try {
    const whereClause = {
      AND: [
        minExperiencia
          ? { experiencia: { gte: parseInt(minExperiencia) } }
          : {},
        modalidad ? { modalidad: modalidad } : {},
      ],
    };

    const tutores = await prisma.tutoresInfo.findMany({
      where: whereClause,
      include: {
        usuario: true,
      },
    });

    res.json(
      tutores.map((t) => ({
        ...t,
        usuario: desencriptarUsuario(t.usuario),
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
