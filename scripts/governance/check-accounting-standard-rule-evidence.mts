#!/usr/bin/env tsx
/**
 * PAS-003 §13.2 — posting rule evidence conformance gate.
 */

import { validateAccountingStandardRuleEvidence } from "../../packages/accounting-standards/src/policy/rule-evidence.policy.ts";

const errors = validateAccountingStandardRuleEvidence();

if (errors.length > 0) {
  console.error("accounting-standard-rule-evidence: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("accounting-standard-rule-evidence: PASS");
