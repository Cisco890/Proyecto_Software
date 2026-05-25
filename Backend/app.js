const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use("/api/login", require("./routes/auth"));
app.use("/api/tutorias", require("./routes/users"));
app.use("/api/tutorias", require("./routes/tutors"));
app.use("/api/tutorias", require("./routes/ratings"));
app.use("/api/tutorias", require("./routes/filters"));
app.use("/api/citas", require("./routes/appointments"));
=======
// Health check endpoint
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/tutorias", require("./routes/users/tutorias"));
app.use("/login", require("./routes/authentication/login"));
const filtroRouter = require("./routes/filters/filtros");
app.use("/api/tutorias", filtroRouter);
const citasRoutes = require("./routes/sessions/sessions");
app.use("/api/citas", citasRoutes);
>>>>>>> b7f733474543261fa852f0dbbe89828a582ff2bc

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor API en http://localhost:${PORT}`);
  });
}

module.exports = app;
