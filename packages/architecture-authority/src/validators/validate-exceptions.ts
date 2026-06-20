import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import { exceptionContract } from "../data/exception-registry.data.js";

export function validateExceptions() {
  const violations: ArchitectureViolation[] = [];
  const now = Date.now();

  for (const exception of exceptionContract.exceptions) {
    const expiresAt = Date.parse(exception.expiresAt);

    if (Number.isNaN(expiresAt)) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `exception for ${exception.packageName} has invalid expiresAt: ${exception.expiresAt}`,
      });
      continue;
    }

    if (expiresAt < now) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `expired exception for ${exception.packageName} (${exception.subject}) — ADR ${exception.adr}`,
      });
    }
  }

  return createValidationResult(violations);
}
