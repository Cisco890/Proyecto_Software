const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//Metodo Post para LOGIN de Usuarios
router.post('/', async (req, res) => {
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
      }else{
        const userData = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            telefono: usuario.telefono,
        }
    
        res.status(200).json({ message: 'Inicio de sesión exitoso', user: userData });
      }

      
    }catch (err) {
      console.error(err.message);
      res.status(500).send("Error del servidor");
    }
    
  
  });
  
  module.exports = router;
  