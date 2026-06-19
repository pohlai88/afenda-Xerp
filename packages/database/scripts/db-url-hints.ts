import { resolveMigrationDatabaseUrl } from "../src/env.js";
import { loadDatabaseEnv } from "./load-env.js";

loadDatabaseEnv();

const url = resolveMigrationDatabaseUrl();
const parsed = new URL(url);

console.log(
  JSON.stringify({
    host: parsed.hostname,
    port: parsed.port || "5432",
    databaseUrlDirectSet: Boolean(process.env.DATABASE_URL_DIRECT?.trim()),
    databaseUrlSet: Boolean(process.env.DATABASE_URL?.trim()),
    directHost: process.env.DATABASE_URL_DIRECT?.trim()
      ? (() => {
          try {
            return new URL(process.env.DATABASE_URL_DIRECT.trim()).hostname;
          } catch {
            return "invalid";
          }
        })()
      : null,
    migrationUrlHost: parsed.hostname,
  })
);
