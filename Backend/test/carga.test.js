const request = require("supertest");
const app = require("../app");

describe("Pruebas de Carga", () => {
  const USUARIOS_CONCURRENTES = 25;
  const REQUESTS_POR_USUARIO = 4;

  beforeAll(() => {
    console.log("🚀 Iniciando pruebas de carga para API de Tutorías");
  });

  test("carga - búsqueda de todos los tutores", async () => {
    console.time("CargaTutores");

    const promises = [];

    // Simular múltiples usuarios buscando tutores simultáneamente
    for (let usuario = 0; usuario < USUARIOS_CONCURRENTES; usuario++) {
      for (
        let request_num = 0;
        request_num < REQUESTS_POR_USUARIO;
        request_num++
      ) {
        promises.push(request(app).get("/api/tutorias/tutores").expect(200));
      }
    }

    const resultados = await Promise.allSettled(promises);
    const exitosos = resultados.filter((r) => r.status === "fulfilled").length;
    const fallidos = resultados.filter((r) => r.status === "rejected").length;

    console.timeEnd("CargaTutores");
    console.log(
      `✅ Exitosos: ${exitosos}/${promises.length} (${(
        (exitosos / promises.length) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`❌ Fallidos: ${fallidos}`);

    expect(exitosos).toBeGreaterThan(promises.length * 0.9); // 90% éxito mínimo
  }, 45000);

  test("carga - filtros por modalidad (endpoint más usado)", async () => {
    console.time("CargaFiltroModalidad");

    const modalidades = ["virtual", "presencial", "hibrido"];
    const promises = [];

    // Múltiples usuarios filtrando por diferentes modalidades
    for (let i = 0; i < USUARIOS_CONCURRENTES; i++) {
      modalidades.forEach((modalidad) => {
        promises.push(
          request(app)
            .get(`/api/tutorias/tutores/modalidad/${modalidad}`)
            .expect(200)
        );
      });
    }

    const inicio = Date.now();
    const resultados = await Promise.allSettled(promises);
    const duracion = Date.now() - inicio;

    const exitosos = resultados.filter((r) => r.status === "fulfilled").length;

    console.timeEnd("CargaFiltroModalidad");
    console.log(`📊 ${promises.length} requests en ${duracion}ms`);
    console.log(
      `⚡ Promedio: ${(duracion / promises.length).toFixed(2)}ms por request`
    );
    console.log(
      `✅ Tasa de éxito: ${((exitosos / promises.length) * 100).toFixed(1)}%`
    );

    expect(exitosos).toBeGreaterThan(promises.length * 0.85);
    expect(duracion / promises.length).toBeLessThan(800); // <800ms promedio
  }, 60000);

  test("carga - endpoints de filtros críticos", async () => {
    const endpointsCriticos = [
      "/api/tutorias/tutores/experiencia?minExperiencia=5",
      "/api/tutorias/tutores/precio?maxPrecio=300",
      "/api/tutorias/tutores/precio?minPrecio=200&maxPrecio=400",
      "/api/tutorias/materias",
    ];

    const promises = [];

    // Simular carga en los endpoints más críticos
    for (let usuario = 0; usuario < 20; usuario++) {
      endpointsCriticos.forEach((endpoint) => {
        promises.push(request(app).get(endpoint).expect(200));
      });
    }

    console.log(
      `🎯 Probando ${promises.length} requests en ${endpointsCriticos.length} endpoints críticos`
    );

    const inicio = Date.now();
    const resultados = await Promise.allSettled(promises);
    const duracion = Date.now() - inicio;

    const exitosos = resultados.filter((r) => r.status === "fulfilled").length;

    console.log(
      `📈 Resultados: ${exitosos}/${promises.length} exitosos en ${duracion}ms`
    );
    console.log(
      `⏱️ Promedio por endpoint: ${(
        duracion / endpointsCriticos.length
      ).toFixed(2)}ms`
    );

    expect(exitosos).toBeGreaterThan(promises.length * 0.7);
  }, 50000);

  test("carga - login de usuarios (endpoint de autenticación)", async () => {
    const promises = [];

    // Simular intentos de login concurrentes (algunos válidos, otros no)
    for (let i = 0; i < USUARIOS_CONCURRENTES; i++) {
      promises.push(
        request(app).post("/login").send({
          correo: "usuario.inexistente@test.com",
          contrasena: "password123",
        })
        // No esperamos 200, puede ser 401, solo que responda
      );
    }

    const inicio = Date.now();
    const resultados = await Promise.allSettled(promises);
    const duracion = Date.now() - inicio;

    const respondieron = resultados.filter(
      (r) => r.status === "fulfilled"
    ).length;

    console.log(
      `🔐 Login bajo carga: ${respondieron}/${promises.length} respondieron`
    );
    console.log(
      `⏱️ Tiempo total: ${duracion}ms, promedio: ${(
        duracion / promises.length
      ).toFixed(2)}ms`
    );

    // El sistema debe responder (aunque sea con error 401)
    expect(respondieron).toBe(promises.length);
    expect(duracion / promises.length).toBeLessThan(1000); // <1s por login
  }, 40000);
});
