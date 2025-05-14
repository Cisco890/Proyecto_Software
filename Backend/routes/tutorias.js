const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


//Metodo Get de todos los usuarios.
router.get('/', async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      take: 10
    });
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Metodo Post De registrar usuario
router.post('/registro', async (req,res) => {
  const {nombre, correo, contrasena, tipo_usuario,telefono} = req.body;

  if (!nombre || !correo || !contrasena || !tipo_usuario || !telefono) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios'});
  }
  else if (!correo.includes('@')) {
    return res.status(400).json({ error: 'El correo debe ser válido' });
  }

  try{
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        correo,
        contrasena,
        tipo_usuario,
        telefono,
      },
    });

    res.status(201).json(nuevoUsuario);
  }catch(err){
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

//Metodo Post para LOGIN de Usuarios
router.post('/login', async (req, res) => {
  const {correo,contrasena} = req.body;
  
  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }


  try {
    const usuario = await prisma.usuarios.findUnique({
      where: {
        correo: correo
      }
    });

    if (!usuario || usuario.contrasena !== contrasena){
      return res.status(401).json({error: "Credenciales incorrectas"});
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', user: usuario });
  }catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
  

});


// Metodo get para obtener el raiting del tutor
router.get('/tutores/:id/rating', async (req, res) => {
  const { id } = req.params;

  try {

    const calificaciones = await prisma.calificaciones.findMany({
      where: {
        id_tutor: parseInt(id),
        calificacion: {
          not: null
        }
      },
      select: {
        calificacion: true
      }
    });

    if (calificaciones.length === 0) {
      return res.json({
        rating_promedio: 0,
        total_calificaciones: 0,
        message: 'Este tutor aún no tiene calificaciones'
      });
    }

    // Calcular promedio
    const suma = calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0);
    const promedio = suma / calificaciones.length;

    res.json({
      rating_promedio: promedio,
      total_calificaciones: calificaciones.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

//Endpoint GET para obtener la información del tutor
router.get('/tutores/info/:idTutor', async (req, res) => {
  const { idTutor } = req.params;

  try {
    // TUTOR INFO
    const tutorInfo = await prisma.tutoresInfo.findUnique({
      where: {
        id: parseInt(idTutor)
      },
      include: {
        usuario: true,
        tutorMaterias: {
          include: {
            materia: true
          }
        }
      }
    });
    //Si no hay respuesta da error
    if (!tutorInfo) {
      return res.status(404).json({ error: 'Tutor no encontrado' });
    }

    //Calificaciones del tutor
    const calificaciones = await prisma.calificaciones.findMany({
      where: {
        id_tutor: tutorInfo.id_usuario,
        calificacion: {
          not: null
        }
      }
    });

    // Rating del tutor como la endpoint anterior
    const rating_promedio = calificaciones.length > 0 
      ? calificaciones.reduce((acc, curr) => acc + curr.calificacion, 0) / calificaciones.length
      : 0;

    // Regresa todos los datos del tutor
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
      materias: tutorInfo.tutorMaterias.map(tm => ({
        id_materia: tm.materia.id_materia,
        nombre_materia: tm.materia.nombre_materia
      })),
      rating_promedio: parseFloat(rating_promedio.toFixed(2)),
      total_calificaciones: calificaciones.length,
      comentarios: calificaciones.filter(c => c.comentario).map(c => ({
        calificacion: c.calificacion,
        comentario: c.comentario,
        fecha: c.fecha_calificacion
      }))
    };
    
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Endpoint para obtener la metodología del tutor
router.get('/tutores/:id/metodologia', async (req, res) => {
  const { id } = req.params;

  try {
    const tutorInfo = await prisma.tutoresInfo.findUnique({
      where: {
        id: parseInt(id)
      },
      select: {
        metodologia: true
      }
    });

    if (!tutorInfo) {
      return res.status(404).json({ error: 'Tutor no encontrado' });
    }

    res.json({
      metodologia: tutorInfo.metodologia || 'No se ha especificado una metodología'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});


module.exports = router;
  