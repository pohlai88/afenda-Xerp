import type { ArchitectureException } from "../contracts/exception.contract.js";
import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import { exceptionContract } from "../data/exception-registry.data.js";

export function validateExceptionEntries(
  exceptions: readonly ArchitectureException[],
  referenceTime = Date.now()
): ReturnType<typeof createValidationResult> {
  const violations: ArchitectureViolation[] = [];

  for (const exception of exceptions) {
    const expiresAt = Date.parse(exception.expiresAt);

    if (Number.isNaN(expiresAt)) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `exception for ${exception.packageName} has invalid expiresAt: ${exception.expiresAt}`,
      });
      continue;
    }

    if (expiresAt < referenceTime) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `expired exception for ${exception.packageName} (${exception.subject}) — ADR ${exception.adr}`,
      });
    }
  }

  return createValidationResult(violations);
}

export function validateExceptions() {
  return validateExceptionEntries(exceptionContract.exceptions);
}
