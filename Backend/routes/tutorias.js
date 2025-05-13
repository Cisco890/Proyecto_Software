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