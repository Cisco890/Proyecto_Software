const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res
      .status(400)
      .json({ error: "Debes ingresar tu correo y contraseña." });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { correo: correo },
    });

    if (!usuario || usuario.contrasena !== contrasena) {
      return res.status(401).json({
        error:
          "Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.",
      });
    }

    res
      .status(200)
      .json({ message: "Inicio de sesión exitoso", user: usuario });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .send(
        "Ha ocurrido un error interno en el servidor. Por favor, intenta nuevamente más tarde."
      );
  }
});

router.post("/registro", async (req, res) => {
  const { nombre, correo, contrasena, tipo_usuario, telefono, foto_perfil } =
    req.body;

  if (!nombre || !correo || !contrasena || !telefono) {
    return res.status(400).json({
      error:
        "Debes completar todos los campos obligatorios: nombre, correo, contraseña y teléfono.",
    });
  } else if (!correo.includes("@")) {
    return res.status(400).json({
      error:
        'El correo ingresado no tiene un formato válido (debe incluir "@").',
    });
  }

  try {
    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        correo,
        contrasena,
        id_perfil: tipo_usuario === "tutor" ? 2 : 1,
        telefono,
        foto_perfil: foto_perfil || null, // Ahora acepta la foto si viene
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .send(
        "Ha ocurrido un error interno en el servidor. Por favor, intenta nuevamente más tarde."
      );
  }
});
module.exports = router;
