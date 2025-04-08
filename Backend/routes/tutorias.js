const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

module.exports = router;
