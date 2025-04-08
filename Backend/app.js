const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient(); 

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const tutoriasRouter = require('./routes/tutorias');
app.use('/api/tutorias', tutoriasRouter);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor API en http://localhost:${PORT}`);
});
