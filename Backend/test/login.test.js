const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const prisma = new PrismaClient();

// Configuración de encriptación
const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(
  process.env.SECRET_KEY || "clave_super_secreta",
  "salt",
  32
);

// Función de encriptación (idéntica al endpoint)
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Función de desencriptación para diagnóstico
function decrypt(encrypted) {
  try {
    const [ivHex, encryptedText] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Error desencriptando:", encrypted);
    return "ERROR_DESENCRIPTACION";
  }
}

// Generar ID único para tests
const testUserId = 999000 + Math.floor(Math.random() * 1000);

// Datos de prueba
const TEST_USER = {
  id_usuario: testUserId,
  nombre: "Usuario Test Login",
  correo: `testlogin.${Date.now()}@login.com`,
  contrasena: "pass1234",
  telefono: "1234567890",
  id_perfil: 2,
};

beforeAll(async () => {
  console.log("\n=== INICIANDO CONFIGURACIÓN DE PRUEBAS LOGIN ===");

  try {
    // 1. Verificar conexión a la base de datos
    await prisma.$connect();
    console.log("✅ Conexión a BD establecida");

    // 2. Crear perfil de tutor si no existe
    await prisma.perfiles.upsert({
      where: { id_perfil: 2 },
      update: {},
      create: { id_perfil: 2, nombre: "Tutor" },
    });
    console.log("✅ Perfil de tutor verificado");

    // 3. Limpiar posibles usuarios de pruebas anteriores
    await prisma.usuarios.deleteMany({
      where: {
        OR: [{ nombre: TEST_USER.nombre }, { id_usuario: testUserId }],
      },
    });
    console.log("✅ Usuarios de prueba anteriores eliminados");

    // 4. Crear usuario directamente en la BD con ID específico
    const encryptedEmail = encrypt(TEST_USER.correo);
    const encryptedPhone = encrypt(TEST_USER.telefono);

    await prisma.usuarios.create({
      data: {
        id_usuario: TEST_USER.id_usuario, // AGREGAR ID específico
        nombre: TEST_USER.nombre,
        correo: encryptedEmail,
        contrasena: await bcrypt.hash(TEST_USER.contrasena, 10),
        telefono: encryptedPhone,
        id_perfil: TEST_USER.id_perfil,
      },
    });
    console.log("✅ Usuario creado directamente en BD con ID:", testUserId);

    // 5. Verificar que el usuario existe
    const usuarioBD = await prisma.usuarios.findUnique({
      where: { id_usuario: testUserId },
    });

    if (!usuarioBD) {
      throw new Error("Usuario no encontrado en BD después de creación");
    }

    console.log("✅ Usuario verificado en BD:", {
      id: usuarioBD.id_usuario,
      nombre: usuarioBD.nombre,
      correoDesencriptado: decrypt(usuarioBD.correo),
    });
  } catch (error) {
    console.error("❌ Error en configuración inicial:", error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Limpieza exhaustiva
    const deleteResult = await prisma.usuarios.deleteMany({
      where: {
        OR: [{ nombre: TEST_USER.nombre }, { id_usuario: testUserId }],
      },
    });
    console.log(` ${deleteResult.count} usuarios de prueba eliminados`);
  } catch (error) {
    console.error(" Error en limpieza:", error);
  } finally {
    await prisma.$disconnect();
  }
});

describe("POST /login", () => {
  test("login exitoso con credenciales correctas", async () => {
    console.log(" Probando login con:", {
      correo: TEST_USER.correo,
      contrasena: "***",
    });

    const res = await request(app).post("/login").send({
      correo: TEST_USER.correo,
      contrasena: TEST_USER.contrasena,
    });

    console.log(" Respuesta login:", {
      status: res.status,
      hasUser: !!res.body.user,
      userId: res.body.user?.id_usuario,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toMatchObject({
      correo: TEST_USER.correo,
      nombre: TEST_USER.nombre,
      id_perfil: TEST_USER.id_perfil,
    });
  });

  test("error cuando faltan campos", async () => {
    const res = await request(app).post("/login").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Debes ingresar tu correo y contraseña.");
  });

  test("error con credenciales incorrectas", async () => {
    const res = await request(app).post("/login").send({
      correo: TEST_USER.correo,
      contrasena: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Correo o contraseña incorrectos/);
  });

  test("error con correo inexistente", async () => {
    const res = await request(app).post("/login").send({
      correo: "noexiste@correo.com",
      contrasena: TEST_USER.contrasena,
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/Correo o contraseña incorrectos/);
  });

  test("no permite inyección SQL en el correo", async () => {
    const res = await request(app)
      .post("/login")
      .send({
        correo: `${TEST_USER.correo}' OR '1'='1`,
        contrasena: TEST_USER.contrasena,
      });

    expect([400, 401]).toContain(res.statusCode);
  });
});
