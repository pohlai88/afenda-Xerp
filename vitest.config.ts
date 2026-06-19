import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["packages/**/src/**/*.test.ts", "apps/**/src/**/*.test.ts"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["packages/**/src/**/*.ts", "apps/**/src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.ts",
        "**/*.d.ts",
        "**/dist/**",
        "**/.next/**",
        "**/node_modules/**",
      ],
    },
  },
});
