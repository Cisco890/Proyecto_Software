// app.js
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/tutorias", require("./routes/tutorias"));
app.use("/api/login", require("./routes/login"));
const filtroRouter = require("./routes/filtros");
app.use("/api/tutorias", filtroRouter);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor API en http://localhost:${PORT}`);
  });
}

module.exports = app;
