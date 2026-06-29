#!/usr/bin/env tsx
/**
 * PAS-003 §13.2 — version registry conformance gate.
 */

import { validateAccountingStandardVersionRegistry } from "../../packages/accounting-standards/src/policy/version-registry.policy.ts";

const errors = validateAccountingStandardVersionRegistry();

if (errors.length > 0) {
  console.error("accounting-standard-version-registry: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("accounting-standard-version-registry: PASS");
