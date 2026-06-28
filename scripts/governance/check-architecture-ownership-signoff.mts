#!/usr/bin/env tsx
/**
 * PAS-002A §4.2 / B39 — ownership baseline sign-off gate.
 *
 * Fails when docs/architecture/ownership-registry.md still carries a pending
 * sign-off marker or lacks the required fingerprint field.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ARCHITECTURE_BASELINE_FINGERPRINT } from "../../packages/architecture-authority/src/index.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const ownershipDocPath = join(
  repoRoot,
  "docs/architecture/ownership-registry.md"
);

const errors: string[] = [];
const content = readFileSync(ownershipDocPath, "utf8");

if (content.includes("Pending Sign-off")) {
  errors.push(
    "ownership-registry.md still contains Pending Sign-off — complete B39 attestation"
  );
}

if (!/\*\*Fingerprint\*\*\s*\|\s*`[^`]+`/.test(content)) {
  errors.push("ownership-registry.md missing **Fingerprint** field");
}

if (!content.includes("ADR-0004")) {
  errors.push("ownership-registry.md must reference ADR-0004 attestation");
}

if (!content.includes(ARCHITECTURE_BASELINE_FINGERPRINT)) {
  errors.push(
    `ownership-registry.md fingerprint must match machine registry (${ARCHITECTURE_BASELINE_FINGERPRINT})`
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
