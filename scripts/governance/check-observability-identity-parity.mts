#!/usr/bin/env tsx

/**
 * PAS-001 §4.1.9 — observability ↔ kernel audit wire pattern parity gate.
 */

import {
  checkObservabilityIdentityParity,
  formatObservabilityIdentityParityViolations,
} from "./identity/observability-identity-parity.governance.mts";

const violations = checkObservabilityIdentityParity();

if (violations.length > 0) {
  console.error("Observability identity parity gate failed:\n");
  console.error(formatObservabilityIdentityParityViolations(violations));
  process.exit(1);
}

console.log(
  "Observability identity parity gate passed (PAS-001 §4.1.9 / ADR-0022)."
);
