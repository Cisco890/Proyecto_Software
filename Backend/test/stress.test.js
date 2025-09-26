const request = require("supertest");
const app = require("../app");

describe("Pruebas de Estrés", () => {
  beforeAll(() => {
    console.log("💥 Iniciando pruebas de estrés - API de Tutorías");
  });

  test("estrés extremo - 100 usuarios simultáneos en endpoint principal", async () => {
    const USUARIOS_ESTRES = 100;
    const promises = [];

    console.log(
      `🔥 Iniciando estrés con ${USUARIOS_ESTRES} usuarios simultáneos...`
    );

    // Bombardear el endpoint principal con 100 requests simultáneos
    for (let i = 0; i < USUARIOS_ESTRES; i++) {
      promises.push(
        request(app).get("/api/tutorias/tutores").timeout(8000) // 8 segundos timeout
      );
    }

    const inicio = Date.now();
    const resultados = await Promise.allSettled(promises);
    const duracion = Date.now() - inicio;

    const exitosos = resultados.filter(
      (r) => r.status === "fulfilled" && r.value.status === 200
    ).length;
    const timeouts = resultados.filter(
      (r) => r.status === "rejected" && r.reason.code === "TIMEOUT"
    ).length;
    const errores = resultados.filter(
      (r) => r.status === "fulfilled" && r.value.status >= 500
    ).length;

    console.log(`📊 Resultados del estrés extremo:`);
    console.log(
      `   ✅ Exitosos: ${exitosos} (${(
        (exitosos / USUARIOS_ESTRES) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`   ⏰ Timeouts: ${timeouts}`);
    console.log(`   💥 Errores 5xx: ${errores}`);
    console.log(`   ⏱️ Tiempo total: ${duracion}ms`);
    console.log(
      `   📈 Promedio: ${(duracion / USUARIOS_ESTRES).toFixed(2)}ms/request`
    );

    // Bajo estrés extremo, debe responder al menos 60%
    expect(exitosos).toBeGreaterThan(USUARIOS_ESTRES * 0.6);
    // No debe haber errores de servidor masivos
    expect(errores).toBeLessThan(USUARIOS_ESTRES * 0.1); // <10% errores 5xx
  }, 120000); // 2 minutos timeout

  test("estrés sostenido - bombardeo por 20 segundos", async () => {
    const DURACION_MS = 20000; // 20 segundos
    const REQUESTS_POR_SEGUNDO = 15;

    console.log(
      `🌊 Estrés sostenido: ${REQUESTS_POR_SEGUNDO} req/s por ${
        DURACION_MS / 1000
      } segundos`
    );

    const inicioTest = Date.now();
    const promises = [];
    let contadorRequests = 0;

    const endpoints = [
      "/api/tutorias/tutores",
      "/api/tutorias/tutores/modalidad/virtual",
      "/api/tutorias/materias",
    ];

    // Bombardeo sostenido
    const intervalo = setInterval(() => {
      if (Date.now() - inicioTest >= DURACION_MS) {
        clearInterval(intervalo);
        return;
      }

      for (let i = 0; i < REQUESTS_POR_SEGUNDO; i++) {
        const endpoint = endpoints[contadorRequests % endpoints.length];
        promises.push(request(app).get(endpoint).timeout(5000));
        contadorRequests++;
      }
    }, 1000);

    // Esperar que termine + tiempo extra para procesar
    await new Promise((resolve) => setTimeout(resolve, DURACION_MS + 2000));

    console.log(`📝 Procesando ${promises.length} requests del bombardeo...`);
    const resultados = await Promise.allSettled(promises);

    const exitosos = resultados.filter(
      (r) => r.status === "fulfilled" && r.value.status === 200
    ).length;
    const fallidos = promises.length - exitosos;

    console.log(`📊 Estrés sostenido completado:`);
    console.log(`   🎯 Total enviados: ${promises.length}`);
    console.log(
      `   ✅ Exitosos: ${exitosos} (${(
        (exitosos / promises.length) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`   ❌ Fallidos: ${fallidos}`);
    console.log(
      `   📊 Throughput: ${(promises.length / (DURACION_MS / 1000)).toFixed(
        1
      )} req/s`
    );

    // Debe mantener al menos 50% éxito bajo estrés sostenido
    expect(exitosos).toBeGreaterThan(promises.length * 0.5);
  }, 40000);

  test("estrés - múltiples filtros complejos simultáneos", async () => {
    const USUARIOS_ESTRES = 50;
    const promises = [];

    const filtrosComplejos = [
      "/api/tutorias/tutores/experiencia?minExperiencia=8",
      "/api/tutorias/tutores/precio?minPrecio=250&maxPrecio=350",
      "/api/tutorias/tutores/modalidad/hibrido",
      "/api/tutorias/tutores/experiencia?minExperiencia=2",
    ];

    console.log(
      `⚡ Estrés en filtros complejos con ${USUARIOS_ESTRES} usuarios`
    );

    // Cada usuario hace múltiples filtros complejos
    for (let usuario = 0; usuario < USUARIOS_ESTRES; usuario++) {
      filtrosComplejos.forEach((filtro) => {
        promises.push(request(app).get(filtro).timeout(6000));
      });
    }

    const inicio = Date.now();
    console.log(
      `🔄 Ejecutando ${promises.length} requests de filtros complejos...`
    );

    const resultados = await Promise.allSettled(promises);
    const duracion = Date.now() - inicio;

    const exitosos = resultados.filter(
      (r) => r.status === "fulfilled" && r.value.status === 200
    ).length;

    console.log(`📈 Filtros complejos bajo estrés:`);
    console.log(`   ✅ Exitosos: ${exitosos}/${promises.length}`);
    console.log(`   ⏱️ Tiempo: ${duracion}ms`);
    console.log(
      `   📊 Promedio: ${(duracion / promises.length).toFixed(2)}ms por filtro`
    );
    console.log(
      `   🎯 Tasa éxito: ${((exitosos / promises.length) * 100).toFixed(1)}%`
    );

    expect(exitosos).toBeGreaterThan(promises.length * 0.6); // 60% mínimo
  }, 90000);

  test("estrés - endpoint de autenticación bajo ataque", async () => {
    const INTENTOS_LOGIN = 80;
    const promises = [];

    console.log(`🔐 Estrés en login: ${INTENTOS_LOGIN} intentos simultáneos`);

    // Simular ataque de fuerza bruta
    for (let i = 0; i < INTENTOS_LOGIN; i++) {
      promises.push(
        request(app)
          .post("/login")
          .send({
            correo: `usuario${i}@fake.com`,
            contrasena: `password${i}`,
          })
          .timeout(4000)
      );
    }

    const inicio = Date.now();
    const resultados = await Promise.allSettled(promises);
    const duracion = Date.now() - inicio;

    const respondieron = resultados.filter(
      (r) => r.status === "fulfilled"
    ).length;
    const timeouts = resultados.filter((r) => r.status === "rejected").length;

    console.log(`🛡️ Login bajo estrés:`);
    console.log(`   📞 Respondieron: ${respondieron}/${INTENTOS_LOGIN}`);
    console.log(`   ⏰ Timeouts: ${timeouts}`);
    console.log(`   ⏱️ Tiempo total: ${duracion}ms`);
    console.log(
      `   📈 Promedio: ${(duracion / INTENTOS_LOGIN).toFixed(2)}ms por intento`
    );

    // El sistema debe responder (aunque rechace el login)
    expect(respondieron).toBeGreaterThan(INTENTOS_LOGIN * 0.8); // 80% debe responder
    expect(duracion / INTENTOS_LOGIN).toBeLessThan(2000); // <2s promedio
  }, 60000);

  test("estrés pico - ráfagas intensas de tráfico", async () => {
    console.log(`🚀 Estrés pico: Simulando tráfico en ráfagas intensas`);

    const RAFAGAS = 3;
    const REQUESTS_POR_RAFAGA = 60;
    const PAUSA_ENTRE_RAFAGAS = 2000; // 2 segundos

    let totalExitosos = 0;
    let totalRequests = 0;
    const tiemposRafaga = [];

    for (let rafaga = 0; rafaga < RAFAGAS; rafaga++) {
      console.log(
        `   🌪️ Ráfaga ${
          rafaga + 1
        }/${RAFAGAS} - ${REQUESTS_POR_RAFAGA} requests simultáneos`
      );

      const promises = [];

      // Crear ráfaga de requests
      for (let i = 0; i < REQUESTS_POR_RAFAGA; i++) {
        promises.push(request(app).get("/api/tutorias/tutores").timeout(6000));
      }

      const inicioRafaga = Date.now();
      const resultados = await Promise.allSettled(promises);
      const duracionRafaga = Date.now() - inicioRafaga;

      const exitososRafaga = resultados.filter(
        (r) => r.status === "fulfilled" && r.value.status === 200
      ).length;

      totalExitosos += exitososRafaga;
      totalRequests += REQUESTS_POR_RAFAGA;
      tiemposRafaga.push(duracionRafaga);

      console.log(
        `      ✅ ${exitososRafaga}/${REQUESTS_POR_RAFAGA} exitosos en ${duracionRafaga}ms`
      );

      // Pausa entre ráfagas (excepto la última)
      if (rafaga < RAFAGAS - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, PAUSA_ENTRE_RAFAGAS)
        );
      }
    }

    const promedioTiempo =
      tiemposRafaga.reduce((a, b) => a + b, 0) / tiemposRafaga.length;
    const tasaExito = (totalExitosos / totalRequests) * 100;

    console.log(`📊 Resumen estrés pico:`);
    console.log(
      `   🎯 Total: ${totalExitosos}/${totalRequests} exitosos (${tasaExito.toFixed(
        1
      )}%)`
    );
    console.log(
      `   ⏱️ Tiempo promedio por ráfaga: ${promedioTiempo.toFixed(2)}ms`
    );
    console.log(
      `   🚀 Throughput pico: ${(
        REQUESTS_POR_RAFAGA /
        (promedioTiempo / 1000)
      ).toFixed(1)} req/s`
    );

    // Debe mantener al menos 70% éxito en ráfagas intensas
    expect(totalExitosos).toBeGreaterThan(totalRequests * 0.7);
  }, 80000);
});
