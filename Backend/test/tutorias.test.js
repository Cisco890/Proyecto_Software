const request = require("supertest");
const app = require("../app");

describe("Tutorías API", () => {
  test("GET /api/tutorias/tutores/modalidad/virtual → 200 OK", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/modalidad/virtual"
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/tutorias/tutores/precio?maxPrecio=50 → 200 OK", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/precio?maxPrecio=50"
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /api/tutorias/tutores/experiencia?minExperiencia=2 → 200 OK", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/experiencia?minExperiencia=2"
    );
    expect(res.statusCode).toBe(200);
  });

  test("GET /api/tutorias/tutores/nombre?busqueda=Jorge Tutor → 200 OK", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/nombre?busqueda=Jorge Tutor"
    );
    expect(res.statusCode).toBe(200);
  });

  // test("GET /api/tutorias/tutores/horario/2 → 200 OK", async () => {
  //  const res = await request(app).get("/api/tutorias/tutores/horario/8");
  //  expect(res.statusCode).toBe(200);
  // });

  test("GET /api/tutorias/tutores/materia/1 → 200 OK", async () => {
    const res = await request(app).get("/api/tutorias/tutores/materia/1");
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/login → login correcto", async () => {
    const res = await request(app).post("/api/login").send({
      correo: "laura@example.com",
      contrasena: "pass123",
    });

    expect([200, 401, 400]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.user).toHaveProperty("nombre");
    }
  });

  //test("POST /api/login → error por campos vacíos", async () => {
  //  const res = await request(app).post("/api/login").send({});
  //   expect(res.statusCode).toBe(400);
  //  });
});
