import { resolveArchitectureValidationReferenceMs } from "../contracts/architecture-authority-version.js";
import type { ArchitectureException } from "../contracts/exception.contract.js";
import { parseIso8601UtcTimestamp } from "../contracts/iso8601-utc-timestamp.js";
import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import { exceptionContract } from "../data/exception-registry.data.js";

function hasNonBlankText(value: string): boolean {
  return value.trim().length > 0;
}

function hasEvidence(entries: readonly string[]): boolean {
  return entries.some((entry) => hasNonBlankText(entry));
}

export function validateExceptionEntries(
  exceptions: readonly ArchitectureException[],
  referenceTime = resolveArchitectureValidationReferenceMs()
): ReturnType<typeof createValidationResult> {
  const violations: ArchitectureViolation[] = [];

  for (const exception of exceptions) {
    if (!hasNonBlankText(exception.id)) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `exception for ${exception.packageName} has invalid id`,
      });
    }

    if (!hasNonBlankText(exception.owner)) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `exception ${exception.id} for ${exception.packageName} has invalid owner`,
      });
    }

    if (!hasEvidence(exception.evidence)) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message:
          exception.status === "active"
            ? `active exception ${exception.id} for ${exception.packageName} requires non-empty evidence`
            : `exception ${exception.id} for ${exception.packageName} requires non-empty evidence`,
      });
    }

    if (
      exception.resolution !== undefined &&
      !hasNonBlankText(exception.resolution)
    ) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `exception ${exception.id} for ${exception.packageName} has blank resolution`,
      });
    }

    const expiresAt = parseIso8601UtcTimestamp(exception.expiresAt);

    if (expiresAt === undefined) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `exception ${exception.id} for ${exception.packageName} has invalid expiresAt: ${exception.expiresAt}`,
      });
      continue;
    }

    if (expiresAt < referenceTime) {
      violations.push({
        gate: "exceptions",
        packageName: exception.packageName,
        message: `expired exception ${exception.id} for ${exception.packageName} (${exception.subject}) — ADR ${exception.adr}`,
      });
    }
  }

  return createValidationResult(violations);
}

export function validateExceptions() {
  return validateExceptionEntries(exceptionContract.exceptions);
}
