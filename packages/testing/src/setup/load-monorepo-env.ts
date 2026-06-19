import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const setupDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(setupDir, "../../../..");
const databaseEnvPath = path.join(repoRoot, "packages/database/.env");

/** Loads synced monorepo env files for integration tests (mirrors database scripts). */
export function loadMonorepoEnv(): void {
  loadEnv({ path: path.join(repoRoot, ".env") });
  loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
  loadEnv({ path: databaseEnvPath, override: true });
}

loadMonorepoEnv();
