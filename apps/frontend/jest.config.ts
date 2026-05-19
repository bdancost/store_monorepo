import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Caminho para o app Next.js para carregar o next.config.js e .env
  dir: "./",
});

// Configurações base que o Next.js vai ler e mesclar corretamente
const baseConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};

// Deixe o Next.js gerenciar a exportação
export default createJestConfig(baseConfig);
