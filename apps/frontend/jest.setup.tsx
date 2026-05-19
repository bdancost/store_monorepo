/* eslint-disable import/no-anonymous-default-export */
import nextJest from "next/jest.js";

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
