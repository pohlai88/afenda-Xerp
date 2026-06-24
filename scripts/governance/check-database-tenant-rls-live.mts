#!/usr/bin/env tsx

/**
 * Live tenant RLS defense-in-depth gate (TIP-007/012 Slice G).
 *
 * Always runs artifact parity first; live Postgres probes are environment-specific.
 */

import { fileURLToPath } from "node:url";

import { resolveMigrationDatabaseUrl } from "../../packages/database/src/env.ts";
import { createPgPool } from "../../packages/database/src/pool.ts";
import {
  isLiveTenantRlsVerificationAvailable,
  type TenantRlsLiveViolation,
  verifyTenantRlsLive,
} from "../../packages/database/src/rls/verify-tenant-rls-live.server.ts";
import {
  checkDatabaseTenantRlsCoverage,
  type TenantRlsCoverageViolation,
} from "./check-database-tenant-rls-coverage.mts";

export type TenantRlsLiveCheckResult =
  | {
      readonly kind: "coverage-failed";
      readonly violations: readonly TenantRlsCoverageViolation[];
    }
  | {
      readonly kind: "skipped";
      readonly reason: string;
    }
  | {
      readonly kind: "live-failed";
      readonly violations: readonly TenantRlsLiveViolation[];
    }
  | { readonly kind: "passed" };

export async function checkDatabaseTenantRlsLive(): Promise<TenantRlsLiveCheckResult> {
  const coverageViolations = checkDatabaseTenantRlsCoverage();
  if (coverageViolations.length > 0) {
    return { kind: "coverage-failed", violations: coverageViolations };
  }

  if (!isLiveTenantRlsVerificationAvailable()) {
    return {
      kind: "skipped",
      reason: "migration database URL unavailable",
    };
  }

  const pool = createPgPool({
    connectionString: resolveMigrationDatabaseUrl(),
    poolConfig: {
      max: 1,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15_000,
      query_timeout: 15_000,
    },
  });

  try {
    const violations = await verifyTenantRlsLive(pool);
    if (violations.length > 0) {
      return { kind: "live-failed", violations };
    }

    return { kind: "passed" };
  } finally {
    await pool.end();
  }
}

async function main(): Promise<void> {
  const result = await checkDatabaseTenantRlsLive();

  switch (result.kind) {
    case "coverage-failed": {
      for (const violation of result.violations) {
        console.error(
          `[${violation.rule}] ${violation.file}: ${violation.message}`
        );
      }
      process.exit(1);
      break;
    }
    case "skipped": {
      console.log(
        `Database tenant RLS live gate skipped: ${result.reason} (artifact coverage passed).`
      );
      break;
    }
    case "live-failed": {
      for (const violation of result.violations) {
        console.error(
          `[${violation.rule}] public.${violation.tableName}: ${violation.message}`
        );
      }
      process.exit(1);
      break;
    }
    case "passed": {
      console.log("Database tenant RLS live gate passed.");
      break;
    }
    default: {
      const exhaustive: never = result;
      throw new Error(`Unhandled tenant RLS live check result: ${exhaustive}`);
    }
  }
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-database-tenant-rls-live.mts")
    );
  } catch {
    return entry.endsWith("check-database-tenant-rls-live.mts");
  }
})();

if (isDirectRun) {
  await main();
}
