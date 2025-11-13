const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const prisma = require("../prisma/client");

router.get("/", async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      where: {
        id_perfil: 2,
      },
      include: {
        tutorInfo: {
          include: {
            tutorMaterias: {
              include: {
                materia: true,
              },
            },
          },
        },
      },
    });
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

router.get("/usuarios/estudiantes", async (req, res) => {
  try {
    const estudiantes = await prisma.usuarios.findMany({
      where: {
        id_perfil: 1,
      },
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        telefono: true,
        foto_perfil: true,
      },
    });

    res.json(estudiantes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

router.post("/registro", async (req, res) => {
  const { nombre, correo, contrasena, tipo_usuario, telefono } = req.body;

  if (!nombre || !correo || !contrasena || !telefono) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  } else if (!correo.includes("@")) {
    return res.status(400).json({ error: "El correo debe ser válido" });
  }

  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        nombre,
        correo,
        contrasena: hashedPassword,
        id_perfil: tipo_usuario === "tutor" ? 2 : 1,
        telefono,
        foto_perfil: "null",
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

router.post("/perfiles", async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res
      .status(400)
      .json({ error: "El nombre del perfil es obligatorio" });
  }

  try {
    const nuevoPerfil = await prisma.perfiles.create({
      data: {
        nombre,
      },
    });

    res.status(201).json(nuevoPerfil);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el perfil" });
  }
});

module.exports = router;
