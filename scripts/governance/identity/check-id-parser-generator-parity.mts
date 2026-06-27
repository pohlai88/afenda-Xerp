#!/usr/bin/env tsx
/** PAS §4.1 — registry parser/generator export parity (delegates to kernel identity surface). */

import {
  checkKernelIdentitySurface,
  formatIdentitySurfaceViolations,
} from "../check-kernel-identity-surface.mts";

const violations = checkKernelIdentitySurface().filter((violation) =>
  [
    "missing-parse",
    "missing-create",
    "missing-parse-canonical",
    "missing-create-canonical",
    "registry-helper-missing",
    "missing-validator",
  ].includes(violation.rule)
);

if (violations.length > 0) {
  console.error("ID parser/generator parity gate failed:\n");
  console.error(formatIdentitySurfaceViolations(violations));
  process.exit(1);
}

console.log("ID parser/generator parity gate passed.");
