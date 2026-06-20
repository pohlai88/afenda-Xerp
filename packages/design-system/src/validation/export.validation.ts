import { publicExportContract } from "../policies/export-surface";
import type { ValidationResult } from "./index";

export function validateExportSurface(
  runtimeExportKeys: readonly string[]
): ValidationResult[] {
  const results: ValidationResult[] = [];
  const stable = new Set<string>(publicExportContract.stableExports);
  const runtime = new Set<string>(runtimeExportKeys);

  // Every stable export must exist at runtime
  for (const name of stable) {
    results.push({
      rule: `export.stable.present: ${name}`,
      passed: runtime.has(name),
      detail: runtime.has(name)
        ? undefined
        : `Stable export "${name}" is listed in publicExportContract but not exported from index.ts`,
    });
  }

  // Every runtime export must be listed as stable
  for (const name of runtime) {
    results.push({
      rule: `export.runtime.declared: ${name}`,
      passed: stable.has(name),
      detail: stable.has(name)
        ? undefined
        : `Runtime export "${name}" is not listed in publicExportContract.stableExports`,
    });
  }

  // Deep imports must be disabled
  results.push({
    rule: "export.deepImports.disabled",
    passed: !publicExportContract.deepImportsAllowed,
    detail: publicExportContract.deepImportsAllowed
      ? "publicExportContract.deepImportsAllowed must be false"
      : undefined,
  });

  return results;
}
