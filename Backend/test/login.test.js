const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const randomSuffix = Date.now();
const TEST_USER = {
  nombre: "Usuario Test",
  correo: `test+${randomSuffix}@login.com`,
  contrasena: "pass1234",
  id_perfil: 2,
};

beforeAll(async () => {
  // Asegura que el perfil 2 (tutor) exista
  await prisma.perfiles.upsert({
    where: { id_perfil: 2 },
    update: {},
    create: { nombre: "Tutor" },
  });

  // Sincroniza la secuencia de id_usuario para evitar duplicados
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      pg_get_serial_sequence('"Usuarios"', 'id_usuario'),
      COALESCE((SELECT MAX(id_usuario) FROM "Usuarios"), 0) + 1,
      false
    );
  `);

  // Crea el usuario de prueba
  await prisma.usuarios.create({
    data: TEST_USER,
  });
});

afterAll(async () => {
  await prisma.usuarios.deleteMany({ where: { correo: TEST_USER.correo } });
  await prisma.$disconnect();
});

describe("POST /api/login", () => {
  test("login exitoso con credenciales correctas", async () => {
    const res = await request(app).post("/api/login").send({
      correo: TEST_USER.correo,
      contrasena: TEST_USER.contrasena,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toMatchObject({
      correo: TEST_USER.correo,
      nombre: TEST_USER.nombre,
      id_perfil: TEST_USER.id_perfil,
    });
    expect(res.body.message).toMatch(/exitoso/i);
  });

  test("error cuando faltan campos", async () => {
    const res = await request(app).post("/api/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("error con credenciales incorrectas", async () => {
    const res = await request(app).post("/api/login").send({
      correo: TEST_USER.correo,
      contrasena: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("no permite inyección simple en el correo", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        correo: `${TEST_USER.correo}' OR '1'='1`,
        contrasena: TEST_USER.contrasena,
      });
    expect([400, 401]).toContain(res.statusCode);
  });
});
