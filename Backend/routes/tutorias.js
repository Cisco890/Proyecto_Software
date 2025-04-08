const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


//Metodo Get
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

// Metodo Post
router.post('/', async (req,res) => {
  const {nombre, correo, contrasena, tipoUsuario,telefono} = req.body;

  if (!nombre || !correo || !contrasena || !tipoUsuario || !telefono) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try{
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        correo,
        contrasena,
        tipoUsuario,
        telefono,
      },
    });

    res.status(201).json(nuevoUsuario);
  }catch(err){
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
