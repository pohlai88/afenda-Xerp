import { resolveMigrationDatabaseUrl } from "../src/env.js";
import { loadDatabaseEnv } from "./load-env.js";

loadDatabaseEnv();

let migrationUrlHost = null;
let migrationUrlPort = null;
let databaseConfigured = false;

try {
  const url = resolveMigrationDatabaseUrl();
  const parsed = new URL(url);
  migrationUrlHost = parsed.hostname;
  migrationUrlPort = parsed.port || "5432";
  databaseConfigured = true;
} catch {
  databaseConfigured = false;
}

console.log(
  JSON.stringify({
    databaseConfigured,
    databaseUrlDirectSet: Boolean(process.env.DATABASE_URL_DIRECT?.trim()),
    databaseUrlExplicitSet: Boolean(process.env.DATABASE_URL?.trim()),
    directHost: process.env.DATABASE_URL_DIRECT?.trim()
      ? (() => {
          try {
            return new URL(process.env.DATABASE_URL_DIRECT.trim()).hostname;
          } catch {
            return "invalid";
          }
        })()
      : null,
    host: migrationUrlHost,
    migrationUrlHost,
    port: migrationUrlPort,
  })
);
