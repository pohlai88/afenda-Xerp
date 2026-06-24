import path from "node:path";

import { loadSyncedEnv, syncedEnvPaths } from "../src/load-synced-env.js";

export const dbDir = syncedEnvPaths.packageRoot;
export const repoRoot = syncedEnvPaths.repoRoot;
export const migrationsDir = path.join(dbDir, "src", "migrations");
export const journalPath = path.join(migrationsDir, "meta", "_journal.json");

/** Loads layered env files for database scripts. */
export function loadDatabaseEnv(): void {
  loadSyncedEnv();
}
