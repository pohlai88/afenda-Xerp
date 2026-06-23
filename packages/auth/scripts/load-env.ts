import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

export const authPackageDir = path.resolve(scriptDir, "..");
export const repoRoot = path.resolve(authPackageDir, "../..");

/** Loads layered env files for auth bootstrap scripts. */
export function loadAuthScriptEnv(): void {
  loadEnv({ path: path.join(repoRoot, ".env") });
  loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
  loadEnv({
    path: path.join(repoRoot, "packages/database/.env"),
    override: true,
  });
  loadEnv({ path: path.join(repoRoot, "apps/erp/.env.local"), override: true });
}
