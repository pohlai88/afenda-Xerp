import type {
  ErpModuleFoundationBundle,
  ModuleRuntimeCompletenessAssertionResult,
} from "./erp-module-foundation.types.js";
import { collectAllOperationCompletenessFailures } from "./internal/runtime-completeness-checks.js";

export function collectModuleRuntimeCompletenessFailures(
  bundle: ErpModuleFoundationBundle
): readonly string[] {
  return collectAllOperationCompletenessFailures(bundle);
}

export function assertModuleRuntimeCompleteness(
  bundle: ErpModuleFoundationBundle
): ModuleRuntimeCompletenessAssertionResult {
  const failures = collectModuleRuntimeCompletenessFailures(bundle);
  if (failures.length > 0) {
    throw new Error(
      `module runtime completeness failed (${failures.length}): ${failures.join("; ")}`
    );
  }
  return { ok: true, module: bundle.module.slug } as const;
}
