#!/usr/bin/env tsx
/**
 * Live probe for ADR-0036 — issues S2S bearer and calls GET /api/internal/v1/auth/service-actor/ping.
 *
 * Prerequisite: ERP dev server on BETTER_AUTH_URL (default http://localhost:3000).
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadMergedEnv } from "../env-utils.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function applyMergedEnv(): void {
  const { entries } = loadMergedEnv(repoRoot);
  for (const [key, value] of entries) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main(): Promise<void> {
  applyMergedEnv();

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
    `Service-actor S2S ping OK — correlationId=${result.correlationId} baseUrl=${baseUrl}`
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Service-actor S2S ping failed: ${message}`);
  console.error(
    "Ensure ERP is running: pnpm --filter @afenda/erp dev (BETTER_AUTH_URL must match)."
  );
  process.exit(1);
});
