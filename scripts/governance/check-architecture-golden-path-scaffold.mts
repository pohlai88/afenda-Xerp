#!/usr/bin/env tsx
/**
 * PAS-002 amendment (B45) — golden-path scaffold CLI enforcement gate.
 */

import { validateGoldenPathScaffoldPolicy } from "../../packages/architecture-authority/src/validators/validate-golden-path-scaffold-policy.ts";

const result = validateGoldenPathScaffoldPolicy();

if (!result.ok) {
  console.error("architecture-golden-path-scaffold: FAIL");
  for (const violation of result.violations) {
    const prefix = violation.packageName ? `${violation.packageName}: ` : "";
    console.error(`  - ${prefix}${violation.message}`);
  }
  process.exit(1);
}

console.log("architecture-golden-path-scaffold: PASS");
