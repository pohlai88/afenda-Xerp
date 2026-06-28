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
 * Call before reading `process.env` in standalone tsx scripts for this package.
 * Vitest loads the same stack via `@afenda/testing` setup; Next.js apps use synced `.env.local`.
 */
export function loadPackageScriptEnv(): void {
  loadEnv({ path: path.join(repoRoot, ".env") });
  loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
  loadEnv({ path: path.join(repoRoot, "packages/database/.env"), override: true });
  loadEnv({ path: path.join(packageRoot, ".env"), override: true });
}

export const packageEnvPaths = {
  repoRoot,
  packageRoot,
  repoEnv: path.join(repoRoot, ".env"),
  repoLocalEnv: path.join(repoRoot, ".env.local"),
  databaseEnv: path.join(repoRoot, "packages/database/.env"),
  packageEnv: path.join(packageRoot, ".env"),
} as const;
