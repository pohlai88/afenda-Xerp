#!/usr/bin/env tsx
/** PAS §4.1 / ADR-0022 — RLS policies must use uuid tenant_id, not enterprise_id strings. */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const rlsDir = join(repoRoot, "packages/database/src/rls");
const violations: string[] = [];

function collectRlsSources(): string[] {
  try {
    return readdirSync(rlsDir)
      .filter((name) => name.endsWith(".sql") || name.endsWith(".ts"))
      .map((name) => readFileSync(join(rlsDir, name), "utf8"));
  } catch {
    return [];
  }
}

const combined = collectRlsSources().join("\n");

if (/enterprise_id\s*~/.test(combined)) {
  violations.push("RLS policy parses enterprise_id with regex");
}

if (/current_setting\([^)]*enterprise_id/.test(combined)) {
  violations.push("RLS uses enterprise_id in current_setting");
}

if (/WHERE\s+[^;]*enterprise_id\s*=/.test(combined)) {
  violations.push("RLS filters on enterprise_id instead of tenant_id uuid");
}

if (violations.length > 0) {
  console.error("RLS uuid tenant-only gate failed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("RLS uuid tenant-only gate passed.");
