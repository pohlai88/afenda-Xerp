#!/usr/bin/env tsx
/**
 * TIP-008B Slice 4 — fail when reserved domain package directories exist on disk.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS } from "../../packages/kernel/src/contracts/business-master-data/business-master-data-scaffold.policy.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const failures: string[] = [];

for (const relativeDir of BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS) {
  const absoluteDir = join(repoRoot, relativeDir);
  if (existsSync(absoluteDir)) {
    failures.push(
      `${relativeDir} exists — PKG-R02–R05 domain packages are blocked until domain TIPs (TIP-008B authority_only).`
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
