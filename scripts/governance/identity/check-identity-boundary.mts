#!/usr/bin/env tsx
/** PAS §4.1 Action 7 — identity boundary guardrails (casts, Brand import, legacy helpers). */

import {
  collectConsumerIdentityBoundarySources,
  collectIdentityBoundaryViolations,
} from "./identity-boundary.governance.mts";

const violations = collectIdentityBoundaryViolations(
  collectConsumerIdentityBoundarySources()
);

if (violations.length > 0) {
  console.error("check:identity-boundary failed:\n");
  for (const violation of violations) {
    console.error(`[${violation.rule}] ${violation.file}: ${violation.message}`);
  }
  process.exit(1);
}

console.log(
  "check:identity-boundary passed (no forbidden enterprise ID casts, Brand imports, or legacy brand helpers)."
);
