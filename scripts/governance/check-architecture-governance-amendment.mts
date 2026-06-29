#!/usr/bin/env tsx
/**
 * PAS-002 amendment (B43+) — architecture governance amendment gate.
 *
 * Validates extension boundary, surface stability, system membership,
 * target-state, golden-path catalog, and reference patterns against
 * governed package-registry rows.
 */

import { validateArchitectureGovernanceAmendment } from "../../packages/architecture-authority/src/validators/validate-architecture-governance-amendment.ts";

const result = validateArchitectureGovernanceAmendment();

if (!result.ok) {
  console.error("architecture-governance-amendment: FAIL");
  for (const violation of result.violations) {
    const prefix = violation.packageName ? `${violation.packageName}: ` : "";
    console.error(`  - ${prefix}${violation.message}`);
  }
  process.exit(1);
}

console.log("architecture-governance-amendment: PASS");
