#!/usr/bin/env tsx
/**
 * Deploy Trigger.dev workers with production overlay env (BETTER_AUTH_URL → Vercel ERP).
 * Syncs S2S secret + production origin to Trigger.cloud via trigger.config syncEnvVars.
 */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadMergedEnv } from "../env-utils.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function applyProductionOverlayEnv(): void {
  const { entries } = loadMergedEnv(repoRoot, {
    overlays: [".env.config.production"],
  });

  for (const [key, value] of entries) {
    process.env[key] = value;
  }
}

function main(): void {
  applyProductionOverlayEnv();

  const baseUrl = process.env["BETTER_AUTH_URL"]?.trim();
  if (!baseUrl || baseUrl.includes("localhost")) {
    console.error(
      "BETTER_AUTH_URL must resolve to production after .env.config.production overlay."
    );
    process.exit(1);
  }

  if (!process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"]?.trim()) {
    console.error(
      "AFENDA_INTERNAL_S2S_SIGNING_SECRET missing — add to .env.secret and run pnpm env:sync."
    );
    process.exit(1);
  }

  console.log(`Trigger deploy with BETTER_AUTH_URL=${baseUrl}`);

  const result = spawnSync(
    "pnpm",
    ["--filter", "@afenda/execution", "trigger:deploy"],
    {
      cwd: repoRoot,
      env: process.env,
      shell: true,
      stdio: "inherit",
    }
  );

  process.exit(result.status ?? 1);
}

main();
