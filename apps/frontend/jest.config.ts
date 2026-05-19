/* eslint-disable import/no-anonymous-default-export */
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Caminho para o app Next.js para carregar o next.config.js e .env
  dir: "./",
});

// Configurações base que você quer aplicar
const baseConfig = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};

// Força o Next.js a resolver a configuração e injeta o setup depois
export default async () => {
  const nextResolvedConfig = await createJestConfig(baseConfig)();

  return {
    ...nextResolvedConfig,
    setupFilesAfterFramework: ["<rootDir>/jest.setup.tsx"], // ou .ts se preferir
  };
};
