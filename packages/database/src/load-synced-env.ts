import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const repoRoot = path.resolve(packageRoot, "../..");

/**
 * Loads layered env files produced by `pnpm env:sync`.
 *
 * Standalone tsx scripts (governance gates, drizzle CLI wrappers) must call
 * this before reading `process.env`. Next.js and Vitest load synced env via
 * their own bootstrap paths.
 */
export function loadSyncedEnv(): void {
  loadEnv({ path: path.join(repoRoot, ".env") });
  loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
  loadEnv({ path: path.join(packageRoot, ".env"), override: true });
}

export const syncedEnvPaths = {
  repoRoot,
  packageRoot,
  repoEnv: path.join(repoRoot, ".env"),
  repoLocalEnv: path.join(repoRoot, ".env.local"),
  packageEnv: path.join(packageRoot, ".env"),
} as const;
