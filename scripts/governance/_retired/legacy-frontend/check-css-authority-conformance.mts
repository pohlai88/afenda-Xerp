#!/usr/bin/env tsx
/**
 * PAS-005 — CSS Authority registry conformance gate.
 */

import { validateCssAuthorityRegistry } from "../../packages/css-authority/src/policy/css-authority.policy.ts";

const errors = validateCssAuthorityRegistry();

if (errors.length > 0) {
  process.stderr.write("css-authority-conformance: FAIL\n");
  for (const error of errors) {
    process.stderr.write(`  - ${error}\n`);
  }
  process.exit(1);
}

process.stdout.write("css-authority-conformance: PASS\n");
