const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("Filtros API Tests - Top 10", () => {
  beforeAll(async () => {
    console.log(" Configurando datos de prueba para filtros...");
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("búsqueda avanzada con múltiples filtros", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/busqueda-avanzada?minExperiencia=2&modalidad=virtual"
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("filtrar tutores por experiencia mínima", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/experiencia?minExperiencia=3"
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("filtrar tutores por modalidad virtual", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/modalidad/virtual"
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("filtrar tutores por precio máximo", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/precio?maxPrecio=300"
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("buscar tutores por nombre", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/nombre?busqueda=Ana"
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("filtrar tutores por rating mínimo", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/rating?minRating=4"
    );
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("verificar que los datos están desencriptados correctamente", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/experiencia?minExperiencia=1"
    );

    if (res.body.length > 0) {
      const tutor = res.body[0];
      if (tutor.usuario) {
        expect(tutor.usuario.correo).not.toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
        expect(tutor.usuario.telefono).not.toMatch(/^[a-f0-9]+:[a-f0-9]+$/);
        expect(tutor.usuario.correo).toMatch(/@/); // Debe contener @
      }
    }
  });

  test("error cuando no se proporciona minExperiencia", async () => {
    const res = await request(app).get("/api/tutorias/tutores/experiencia");
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("error cuando no se proporciona maxPrecio", async () => {
    const res = await request(app).get("/api/tutorias/tutores/precio");
    expect(res.statusCode).toBe(400);
  });

  test("verificar estructura de respuesta en búsqueda avanzada", async () => {
    const res = await request(app).get(
      "/api/tutorias/tutores/busqueda-avanzada?minExperiencia=1"
    );

    if (res.body.length > 0) {
      const tutor = res.body[0];
      expect(tutor).toHaveProperty("ratingPromedio");
      expect(tutor).toHaveProperty("totalCalificaciones");
      expect(typeof tutor.ratingPromedio).toBe("number");
    }
  });
});
