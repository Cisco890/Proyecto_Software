const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//Metodo Get de los nombres de los tutores
router.get('/nombre',async (req,res)=>{
    const nombre = await prisma.perfiles;
    const id_perfil = await prisma.perfiles; 

    try{
        const nombres = await prisma.usuarios.findMany({
            
        })        


    }catch (err){
        console.error(err.message);
        res.status(500).send('Error del servidor')
    }
})



// Filtro de horarios (vespertino, matutino, nocturno)
router.get('/horarios/:horario', async (req, res) => {
  const { horario } = req.params;

  try {
    const tutores = await prisma.tutorMateria.findMany({
      where: {
        horario: horario
      },
      include: {
        tutor: {
          include: {
            usuario: true
          }
        },
        materia: true
      }
    });

    res.json(tutores.map(tm => ({
      ...tm.tutor,
      usuario: tm.tutor.usuario,
      })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// EndPoint tutores por experiencia
router.get('/tutores/experiencia', async (req, res) => {
  const { minExperiencia } = req.query;

  if (!minExperiencia || isNaN(minExperiencia)) {
    return res.status(400).json({ error: 'Debe proporcionar un valor mínimo de experiencia válido' });
  }

  try {
    const tutores = await prisma.tutoresInfo.findMany({
      where: {
        experiencia: {
          gte: parseInt(minExperiencia)
        }
      },
      include: {
        usuario: true
      }
    });

    res.json(tutores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// EndPoint filtro por materia
router.get('/tutores/materia/:idMateria', async (req, res) => {
  const { idMateria } = req.params;

  try {
    const tutores = await prisma.tutorMateria.findMany({
      where: {
        id_materia: parseInt(idMateria)
      },
      include: {
        tutor: {
          include: {
            usuario: true
          }
        },
        materia: true
      }
    });

    res.json(tutores.map(tm => ({
      ...tm.tutor,
      usuario: tm.tutor.usuario,
      })));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Filtro por modalidad
router.get('/tutores/modalidad/:modalidad', async (req, res) => {
  const { modalidad } = req.params;

  try {
    const tutores = await prisma.tutoresInfo.findMany({
      where: {
        metodo_ensenanza: modalidad // 'virtual', 'presencial' o 'hibrido'
      },
      include: {
        usuario: true
      }
    });

    res.json(tutores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});
module.exports = router;


// Filtro por horario
router.get('/tutores/horario/:hora', async (req, res) => {
  const { hora } = req.params;

  if (!hora || isNaN(hora)) {
    return res.status(400).json({ error: 'Debe proporcionar una hora válida (0-23)' });
  }

  try {
    const tutores = await prisma.tutoresInfo.findMany({
      where: {
        horario: parseInt(hora)
      },
      include: {
        usuario: true
      }
    });

    res.json(tutores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Filtro por precio
// /api/tutorias/tutores/precio?maxPrecio=25.00
router.get('/tutores/precio', async (req, res) => {
  const { maxPrecio } = req.query;

  if (!maxPrecio || isNaN(maxPrecio)) {
    return res.status(400).json({ error: 'Debe proporcionar un precio máximo válido' });
  }

  try {
    const tutores = await prisma.tutoresInfo.findMany({
      where: {
        tarifa_hora: {
          lte: parseFloat(maxPrecio)
        }
      },
      include: {
        usuario: true
      }
    });

    res.json(tutores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

//Endo point que filtre por raiting.
// /api/tutorias/tutores/rating?minRating=4.0
router.get('/tutores/rating', async (req, res) => {
  const { minRating } = req.query;

  if (!minRating || isNaN(minRating)) {
    return res.status(400).json({ error: 'Debe proporcionar un rating mínimo válido' });
  }

  try {
    const resultados = await prisma.calificaciones.groupBy({
      by: ['id_tutor'],
      _avg: {
        calificacion: true
      },
      having: {
        calificacion: {
          _avg: {
            gte: parseFloat(minRating)
          }
        }
      }
    });

    // Obtener IDs de tutores filtrados
    const tutorIds = resultados.map(r => r.id_tutor);

    const tutores = await prisma.usuarios.findMany({
      where: {
        id_usuario: { in: tutorIds }
      },
      include: {
        tutorInfo: true
      }
    });

    res.json(tutores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// FIltro que devuelva el rating promedio de los tutores
// /api/tutorias/tutores/rating?minRating=4.0
router.get('/tutores/rating', async (req, res) => {
  const { minRating } = req.query;

  if (!minRating || isNaN(minRating)) {
    return res.status(400).json({ error: 'Debe proporcionar un rating mínimo válido' });
  }

  try {
    const resultados = await prisma.calificaciones.groupBy({
      by: ['id_tutor'],
      _avg: {
        calificacion: true
      },
      having: {
        calificacion: {
          _avg: {
            gte: parseFloat(minRating)
          }
        }
      }
    });

    // Obtener IDs de tutores filtrados
    const tutorIds = resultados.map(r => r.id_tutor);

    const tutores = await prisma.usuarios.findMany({
      where: {
        id_usuario: { in: tutorIds }
      },
      include: {
        tutorInfo: true
      }
    });

    res.json(tutores);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});



