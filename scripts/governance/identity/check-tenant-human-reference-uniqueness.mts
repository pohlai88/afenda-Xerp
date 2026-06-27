#!/usr/bin/env tsx
/** PAS §4.1 / ADR-0023 — tenant human reference composite uniqueness gate. */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { LIVE_TENANT_HUMAN_REFERENCE_TABLES } from "../../../packages/database/src/ids/tenant-human-reference-registry.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const schemaDir = join(repoRoot, "packages/database/src/schema");
const violations: string[] = [];

for (const entry of LIVE_TENANT_HUMAN_REFERENCE_TABLES) {
  const schemaPath = join(schemaDir, entry.schemaFile);
  if (!existsSync(schemaPath)) {
    violations.push(`Missing schema ${entry.schemaFile} for ${entry.tableName}`);
    continue;
  }

  const source = readFileSync(schemaPath, "utf8");

  if (!source.includes("tenantHumanReferenceColumn")) {
    violations.push(
      `${entry.schemaFile}: ${entry.column} must use tenantHumanReferenceColumn`
    );
  }

  if (
    !source.includes(entry.uniqueIndexName) &&
    !source.includes(
      `tenantHumanReferenceUniqueIndexName("${entry.tableName}", "${entry.column}")`
    )
  ) {
    violations.push(
      `${entry.schemaFile}: missing unique index ${entry.uniqueIndexName}`
    );
  }

  if (!source.includes("table.tenantId")) {
    violations.push(
      `${entry.schemaFile}: composite unique must include table.tenantId`
    );
  }
}

if (violations.length > 0) {
  console.error("Tenant human reference uniqueness gate failed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("Tenant human reference uniqueness gate passed.");
