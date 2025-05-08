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
