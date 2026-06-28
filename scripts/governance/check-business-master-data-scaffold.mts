#!/usr/bin/env tsx
/**
 * Foundation phase 08 Slice 4 — fail when reserved domain package directories exist on disk.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS } from "../../packages/architecture-authority/src/index.ts";
import { BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS as SCAFFOLD_FORBIDDEN_DIRS } from "./business-master-data-scaffold-dirs.mjs";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const failures: string[] = [];

const policyDirs = [...BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS].sort();
const scaffoldDirs = [...SCAFFOLD_FORBIDDEN_DIRS].sort();

if (JSON.stringify(policyDirs) !== JSON.stringify(scaffoldDirs)) {
  failures.push(
    "scripts/governance/business-master-data-scaffold-dirs.mjs drift from architecture-authority BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS — sync both sources."
  );
}

for (const relativeDir of BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS) {
  const absoluteDir = join(repoRoot, relativeDir);
  if (existsSync(absoluteDir)) {
    failures.push(
      `${relativeDir} exists — domain packages are blocked until ADR + registry promotion (ADR-0020 retired packages/inventory).`
    );
  }
}

if (failures.length > 0) {
  console.error("business-master-data-scaffold guard failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    "business-master-data-scaffold guard passed (no reserved domain package directories)."
  );
}
