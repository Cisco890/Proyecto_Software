const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Método POST para LOGIN de usuarios
router.post('/', async (req, res) => {
  const { correo, contrasena } = req.body;

  // Validación básica
  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { correo }
    });

    if (!usuario || usuario.contrasena !== contrasena) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Estructura limpia para enviar solo lo necesario al frontend
    const userData = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      id_perfil: usuario.id_perfil,
    };

    res.status(200).json({ message: 'Inicio de sesión exitoso', user: userData });
  } catch (err) {
    console.error('❌ Error al iniciar sesión:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
