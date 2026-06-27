import { resolveArchitectureValidationReferenceMs } from "../contracts/architecture-authority-version.js";
import { parseIso8601UtcTimestamp } from "../contracts/iso8601-utc-timestamp.js";
import type { LifecycleContract } from "../contracts/lifecycle.contract.js";
import type { PackageDefinition } from "../contracts/package.contract.js";
import { PACKAGE_REGISTRY_STATUSES } from "../contracts/package.contract.js";
import type { ArchitectureViolation } from "../contracts/validation-result.contract.js";
import { createValidationResult } from "../contracts/validation-result.contract.js";
import { lifecycleContract } from "../data/lifecycle-registry.data.js";
import { packageContract } from "../data/package-registry.data.js";

const LIFECYCLE_GATE = "lifecycle" as const;

const INACTIVE_LIFECYCLE_STATUSES = new Set<
  (typeof PACKAGE_REGISTRY_STATUSES)[number]
>(["planned", "deprecated", "retired"]);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function calendarMonthsBetween(startMs: number, endMs: number): number {
  const start = new Date(startMs);
  const end = new Date(endMs);
  return (
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth())
  );
}

function validateExperimentalLifecycle(
  pkg: PackageDefinition,
  policy: LifecycleContract,
  referenceDateMs: number
): ArchitectureViolation[] {
  if (pkg.lifecycle !== "experimental") {
    return [];
  }

  const violations: ArchitectureViolation[] = [];

  if (!pkg.experimentalStartedAt) {
    violations.push({
      gate: LIFECYCLE_GATE,
      packageName: pkg.packageName,
      message:
        "lifecycle experimental requires experimentalStartedAt (ISO-8601 UTC)",
    });
  }

  if (!pkg.experimentalExpiresAt) {
    violations.push({
      gate: LIFECYCLE_GATE,
      packageName: pkg.packageName,
      message:
        "lifecycle experimental requires experimentalExpiresAt (ISO-8601 UTC)",
    });
  }

  if (!(pkg.experimentalStartedAt && pkg.experimentalExpiresAt)) {
    return violations;
  }

  const startedAtMs = parseIso8601UtcTimestamp(pkg.experimentalStartedAt);
  if (startedAtMs === undefined) {
    violations.push({
      gate: LIFECYCLE_GATE,
      packageName: pkg.packageName,
      message: `experimentalStartedAt must be ISO-8601 UTC (${pkg.experimentalStartedAt})`,
    });
  }

  const expiresAtMs = parseIso8601UtcTimestamp(pkg.experimentalExpiresAt);
  if (expiresAtMs === undefined) {
    violations.push({
      gate: LIFECYCLE_GATE,
      packageName: pkg.packageName,
      message: `experimentalExpiresAt must be ISO-8601 UTC (${pkg.experimentalExpiresAt})`,
    });
  }

  if (startedAtMs === undefined || expiresAtMs === undefined) {
    return violations;
  }

  if (startedAtMs > referenceDateMs) {
    violations.push({
      gate: LIFECYCLE_GATE,
      packageName: pkg.packageName,
      message: `experimentalStartedAt must not be in the future (${pkg.experimentalStartedAt})`,
    });
  }

  if (expiresAtMs < startedAtMs) {
    violations.push({
      gate: LIFECYCLE_GATE,
      packageName: pkg.packageName,
      message:
        "experimentalExpiresAt must be on or after experimentalStartedAt",
    });
  }

  if (expiresAtMs < referenceDateMs) {
    violations.push({
      gate: LIFECYCLE_GATE,
      packageName: pkg.packageName,
      message: `experimental package expired on ${pkg.experimentalExpiresAt}`,
    });
  }

  const experimentalSpanMs = expiresAtMs - startedAtMs;
  const maxSpanMs = policy.experimentalMaxDays * MS_PER_DAY;
  if (experimentalSpanMs > maxSpanMs) {
    violations.push({
      gate: LIFECYCLE_GATE,
      packageName: pkg.packageName,
      message: `experimental window (${pkg.experimentalStartedAt} → ${pkg.experimentalExpiresAt}) exceeds policy.experimentalMaxDays (${policy.experimentalMaxDays})`,
    });
  }

  return violations;
}

function validateDeprecatedLifecycle(
  pkg: PackageDefinition,
  policy: LifecycleContract,
  referenceDateMs: number
): ArchitectureViolation[] {
  if (pkg.lifecycle !== "deprecated") {
    return [];
  }

  if (!pkg.deprecatedAt) {
    return [
      {
        gate: LIFECYCLE_GATE,
        packageName: pkg.packageName,
        message: "lifecycle deprecated requires deprecatedAt (ISO-8601 UTC)",
      },
    ];
  }

  const deprecatedAtMs = parseIso8601UtcTimestamp(pkg.deprecatedAt);
  if (deprecatedAtMs === undefined) {
    return [
      {
        gate: LIFECYCLE_GATE,
        packageName: pkg.packageName,
        message: `deprecatedAt must be ISO-8601 UTC (${pkg.deprecatedAt})`,
      },
    ];
  }

  if (deprecatedAtMs > referenceDateMs) {
    return [
      {
        gate: LIFECYCLE_GATE,
        packageName: pkg.packageName,
        message: `deprecatedAt must not be in the future (${pkg.deprecatedAt})`,
      },
    ];
  }

  const monthsDeprecated = calendarMonthsBetween(
    deprecatedAtMs,
    referenceDateMs
  );
  if (monthsDeprecated > policy.maxDeprecationMonths) {
    return [
      {
        gate: LIFECYCLE_GATE,
        packageName: pkg.packageName,
        message: `deprecated for ${monthsDeprecated} months exceeds policy.maxDeprecationMonths (${policy.maxDeprecationMonths}) — Architecture Authority review required`,
      },
    ];
  }

  return [];
}

export function collectLifecycleViolations(
  policy: LifecycleContract,
  packages: readonly PackageDefinition[],
  referenceDateMs: number
): ArchitectureViolation[] {
  const violations: ArchitectureViolation[] = [];

  if (policy.experimentalMaxDays <= 0) {
    violations.push({
      gate: LIFECYCLE_GATE,
      message: "lifecycleContract.experimentalMaxDays must be positive",
    });
  }

  if (policy.maxDeprecationMonths <= 0) {
    violations.push({
      gate: LIFECYCLE_GATE,
      message: "lifecycleContract.maxDeprecationMonths must be positive",
    });
  }

  for (const pkg of packages) {
    if (
      !(PACKAGE_REGISTRY_STATUSES as readonly string[]).includes(pkg.lifecycle)
    ) {
      violations.push({
        gate: LIFECYCLE_GATE,
        packageName: pkg.packageName,
        message: `unknown lifecycle status ${pkg.lifecycle}`,
      });
    }

    if (
      INACTIVE_LIFECYCLE_STATUSES.has(pkg.lifecycle) &&
      pkg.filesystemRequired
    ) {
      violations.push({
        gate: LIFECYCLE_GATE,
        packageName: pkg.packageName,
        message: `lifecycle ${pkg.lifecycle} requires filesystemRequired: false`,
      });
    }

    violations.push(
      ...validateExperimentalLifecycle(pkg, policy, referenceDateMs),
      ...validateDeprecatedLifecycle(pkg, policy, referenceDateMs)
    );
  }

  return violations;
}

export function validateLifecycle(
  options: { referenceDateMs?: number; referenceIso?: string } = {}
) {
  return createValidationResult(
    collectLifecycleViolations(
      lifecycleContract,
      packageContract.packages,
      resolveArchitectureValidationReferenceMs(options)
    )
  );
}
