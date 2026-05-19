/* eslint-disable import/no-anonymous-default-export */
import "@testing-library/jest-dom";
import nextJest from "next/jest.js";

// Mock para evitar o erro de layout não implementado no JSDOM
Object.defineProperty(window, "scrollTo", { value: jest.fn(), writable: true });

const createJestConfig = nextJest({
  dir: "./",
});

const baseConfig = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
};

// Modifique para exportar a função resolvida na marra
const asyncConfig = createJestConfig(baseConfig);

export default async () => {
  const config = await asyncConfig();
  return {
    ...config,
    setupFilesAfterFramework: ["<rootDir>/jest.setup.tsx"],
  };
};
