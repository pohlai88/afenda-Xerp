#!/usr/bin/env tsx
/**
 * PAS-002A §4.2 / B39 — ownership baseline sign-off gate.
 *
 * Validates machine ownership registry completeness (human markdown registries retired).
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ownershipContract } from "../../packages/architecture-authority/src/data/ownership-registry.data.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const ownershipDataPath = join(
  repoRoot,
  "packages/architecture-authority/src/data/ownership-registry.data.ts"
);

const errors: string[] = [];
const content = readFileSync(ownershipDataPath, "utf8");

if (!content.includes("ADR-0004")) {
  errors.push("ownership-registry.data.ts must reference ADR-0004 attestation");
}

const missingOwner = ownershipContract.packages.filter(
  (entry) => entry.ownerDomain.trim().length === 0
);

if (missingOwner.length > 0) {
  errors.push(
    `ownership-registry.data.ts has ${missingOwner.length} package(s) without owner`
  );
}

if (errors.length > 0) {
  console.error("architecture-ownership-signoff: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("architecture-ownership-signoff: PASS");
