import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

import {
  getDedicatedDatabaseUrl,
  getDirectDatabaseUrl,
  getSessionDatabaseUrl,
} from "./src/env.js";

const configDir = path.dirname(fileURLToPath(import.meta.url));

loadEnv({ path: path.resolve(configDir, "../../.env") });
loadEnv({ path: path.resolve(configDir, "../../.env.local"), override: true });
loadEnv({ path: path.resolve(configDir, ".env"), override: true });

function resolveMigrationDatabaseUrl(): string {
  const directUrl = process.env.DATABASE_URL_DIRECT?.trim();
  if (directUrl) {
    return directUrl;
  }

  const dedicatedUrl = process.env.DATABASE_URL_DEDICATED?.trim();
  if (dedicatedUrl) {
    return dedicatedUrl;
  }

  const sessionUrl = process.env.DATABASE_URL_SESSION?.trim();
  if (sessionUrl) {
    return sessionUrl;
  }

  try {
    return getSessionDatabaseUrl();
  } catch {
    // fall through
  }

  try {
    return getDedicatedDatabaseUrl();
  } catch {
    // fall through
  }

  try {
    return getDirectDatabaseUrl();
  } catch {
    return (
      process.env.DATABASE_URL?.trim() ??
      "postgresql://postgres:postgres@127.0.0.1:5432/postgres"
    );
  }
}

const databaseUrl = resolveMigrationDatabaseUrl();

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  migrations: {
    prefix: "timestamp",
  },
  strict: true,
  verbose: true,
});
