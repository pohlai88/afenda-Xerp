#!/usr/bin/env tsx
/**
 * Live probe for ADR-0036 — issues S2S bearer and calls GET /api/internal/v1/auth/service-actor/ping.
 *
 * Usage:
 *   pnpm probe:service-actor-s2s-ping              # local BETTER_AUTH_URL (dev server)
 *   pnpm probe:service-actor-s2s-ping --production  # production overlay URL (Vercel ERP)
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadMergedEnv } from "../env-utils.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function applyMergedEnv(useProductionOverlay: boolean): void {
  const { entries } = loadMergedEnv(repoRoot, {
    overlays: useProductionOverlay ? [".env.config.production"] : [],
  });
  for (const [key, value] of entries) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main(): Promise<void> {
  const useProduction = process.argv.includes("--production");
  applyMergedEnv(useProduction);

  if (!process.env["AFENDA_INTERNAL_S2S_SIGNING_SECRET"]) {
    console.error(
      "AFENDA_INTERNAL_S2S_SIGNING_SECRET is missing. Add to .env.secret and run pnpm env:sync."
    );
    process.exit(1);
  }

  const baseUrl =
    process.env["BETTER_AUTH_URL"]?.trim() ?? "http://localhost:3000";

  const { runServiceActorS2sPingProbe } = await import(
    "../../apps/erp/src/lib/auth/service-actor-s2s-ping.client.server.ts"
  );

  const result = await runServiceActorS2sPingProbe({ baseUrl });
  console.log(
    `Service-actor S2S ping OK — correlationId=${result.correlationId} baseUrl=${baseUrl}${useProduction ? " (production overlay)" : ""}`
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Service-actor S2S ping failed: ${message}`);
  console.error(
    useProductionHint(process.argv.includes("--production"))
  );
  process.exit(1);
});

function useProductionHint(isProduction: boolean): string {
  if (isProduction) {
    return "Ensure production ERP is deployed with AFENDA_INTERNAL_S2S_SIGNING_SECRET (pnpm env:push:production).";
  }
  return "Ensure ERP is running: pnpm --filter @afenda/erp dev (BETTER_AUTH_URL must match).";
}
