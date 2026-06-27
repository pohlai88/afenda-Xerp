#!/usr/bin/env tsx
/** PAS §4.1.12 / ADR-0022 — split-ID persistence gate (uuid PK, enterprise_id lookup, no human-ref FK). */

import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { checkSplitIdPersistenceContract } from "../../../packages/database/src/ids/split-id-persistence.governance.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const schemaDir = join(repoRoot, "packages/database/src/schema");
const violations = checkSplitIdPersistenceContract(schemaDir);

if (violations.length > 0) {
  console.error("Split-ID persistence gate failed:\n");
  for (const violation of violations) {
    console.error(
      `[${violation.rule}] ${violation.file}: ${violation.message}`
    );
  }
  process.exit(1);
}

console.log("Split-ID persistence gate passed (PAS §4.1.12 / ADR-0022).");
