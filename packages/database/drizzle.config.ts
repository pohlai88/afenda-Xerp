import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

import { resolveMigrationDatabaseUrl } from "./src/env.js";

const configDir = path.dirname(fileURLToPath(import.meta.url));

loadEnv({ path: path.resolve(configDir, "../../.env") });
loadEnv({ path: path.resolve(configDir, "../../.env.local"), override: true });
loadEnv({ path: path.resolve(configDir, ".env"), override: true });

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: resolveMigrationDatabaseUrl(),
  },
  migrations: {
    prefix: "timestamp",
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
