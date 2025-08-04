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


module.exports = router;
