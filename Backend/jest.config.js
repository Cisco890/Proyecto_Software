module.exports = {
  testEnvironment: "node",
  testTimeout: 120000, // 2 minutos timeout para pruebas de carga
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/test/**",
    "!prisma/**",
  ],
  testMatch: ["**/test/**/*.test.js"],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true, // Importante para pruebas de carga
};
