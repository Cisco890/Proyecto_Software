// app.js
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/tutorias", require("./routes/users/tutorias"));
app.use("/login", require("./routes/authentication/login"));
const filtroRouter = require("./routes/filters/filtros");
app.use("/filtro", filtroRouter); //a
const citasRoutes = require("./routes/sessions/sessions");
app.use("/api/citas", citasRoutes);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor API en http://localhost:${PORT}`);
  });
}

module.exports = app;
