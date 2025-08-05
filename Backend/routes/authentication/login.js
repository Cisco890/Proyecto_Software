const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const prisma = new PrismaClient();

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(
  process.env.SECRET_KEY || "clave_super_secreta",
  "salt",
  32
);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encrypted) {
  const [ivHex, encryptedText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

//Login
router.post("/", async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res
      .status(400)
      .json({ error: "Debes ingresar tu correo y contraseña." });
  }

  try {
    const correoEncriptado = encrypt(correo);
    const usuario = await prisma.usuarios.findUnique({
      where: { correo: correoEncriptado },
    });

    if (!usuario) {
      return res.status(401).json({
        error:
          "Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.",
      });
    }

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      return res.status(401).json({
        error:
          "Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.",
      });
    }

    // Desencripta antes de enviar al frontend
    usuario.correo = decrypt(usuario.correo);
    usuario.telefono = decrypt(usuario.telefono);

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

//Registro
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
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const correoEncriptado = encrypt(correo);
    const telefonoEncriptado = encrypt(telefono);

    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        correo: correoEncriptado,
        contrasena: hashedPassword,
        id_perfil: tipo_usuario === "tutor" ? 2 : 1,
        telefono: telefonoEncriptado,
        foto_perfil: foto_perfil || null,
      },
    });

    // Desencripta antes de enviar al frontend
    nuevoUsuario.correo = correo;
    nuevoUsuario.telefono = telefono;

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
