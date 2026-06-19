import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

export const dbDir = path.resolve(scriptDir, "..");
export const repoRoot = path.resolve(dbDir, "../..");
export const migrationsDir = path.join(dbDir, "src", "migrations");
export const journalPath = path.join(migrationsDir, "meta", "_journal.json");

/** Loads layered env files for database scripts. */
export function loadDatabaseEnv(): void {
  loadEnv({ path: path.join(repoRoot, ".env") });
  loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
  loadEnv({ path: path.join(dbDir, ".env"), override: true });
}
