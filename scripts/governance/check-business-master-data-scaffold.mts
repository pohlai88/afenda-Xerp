#!/usr/bin/env tsx
/**
 * TIP-008B Slice 4 — fail when reserved domain package directories exist on disk.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS } from "../../packages/architecture-authority/src/index.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const failures: string[] = [];

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
