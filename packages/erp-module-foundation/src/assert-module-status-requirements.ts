import { listRequiredReadinessDimensions } from "./define-module-readiness.js";
import type { ErpModuleFoundationBundle } from "./erp-module-foundation.types.js";
import { collectAllStatusRequirementFailures } from "./internal/status-requirement-checks.js";

export function collectModuleStatusRequirementFailures(
  bundle: ErpModuleFoundationBundle
): readonly string[] {
  return collectAllStatusRequirementFailures(bundle);
}

export function assertModuleStatusRequirements(
  bundle: ErpModuleFoundationBundle
): void {
  const failures = collectModuleStatusRequirementFailures(bundle);
  if (failures.length > 0) {
    throw new Error(
      `module status requirements failed (${failures.length}): ${failures.join("; ")}`
    );
  }
}

export function collectEvidencePathFailures(
  bundle: ErpModuleFoundationBundle,
  validatePaths: (path: string) => boolean
): readonly string[] {
  const failures: string[] = [];
  const required = listRequiredReadinessDimensions(bundle.readiness);

  for (const dimension of required) {
    const evidence = bundle.evidence?.[dimension];
    if (evidence && !validatePaths(evidence)) {
      failures.push(
        `readiness evidence for "${dimension}" path does not exist: "${evidence}"`
      );
    }
  }

  return failures;
}
