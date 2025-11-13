const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/login", require("./routes/auth"));
app.use("/api/tutorias", require("./routes/users"));
app.use("/api/tutorias", require("./routes/tutors"));
app.use("/api/tutorias", require("./routes/ratings"));
app.use("/api/tutorias", require("./routes/filters"));
app.use("/api/citas", require("./routes/appointments"));

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Servidor API en http://localhost:${PORT}`);
  });
}

module.exports = app;
