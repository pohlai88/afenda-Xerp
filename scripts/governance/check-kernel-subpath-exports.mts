#!/usr/bin/env tsx
/**
 * Kernel PAS §6.4 subpath export surface gate.
 *
 * Verifies package.json exports match kernel-package-layout.contract.ts,
 * src barrels exist, and subpath-exports.test.ts covers every registered key.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { KERNEL_PACKAGE_SUBPATH_EXPORTS } from "../../packages/kernel/src/contracts/kernel-package-layout.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface KernelSubpathExportSpec {
  readonly distImport: string;
  readonly distTypes: string;
  readonly srcBarrel: string;
}

const PAS_64_SUBPATH_BARRELS = {
  ".": {
    srcBarrel: "packages/kernel/src/index.ts",
    distImport: "./dist/index.js",
    distTypes: "./dist/index.d.ts",
  },
  "./context": {
    srcBarrel: "packages/kernel/src/context/index.ts",
    distImport: "./dist/context/index.js",
    distTypes: "./dist/context/index.d.ts",
  },
  "./erp-domain/accounting": {
    srcBarrel: "packages/kernel/src/erp-domain/accounting/index.ts",
    distImport: "./dist/erp-domain/accounting/index.js",
    distTypes: "./dist/erp-domain/accounting/index.d.ts",
  },
  "./propagation": {
    srcBarrel: "packages/kernel/src/propagation/index.ts",
    distImport: "./dist/propagation/index.js",
    distTypes: "./dist/propagation/index.d.ts",
  },
  "./events": {
    srcBarrel: "packages/kernel/src/events/index.ts",
    distImport: "./dist/events/index.js",
    distTypes: "./dist/events/index.d.ts",
  },
  "./policy": {
    srcBarrel: "packages/kernel/src/policy/index.ts",
    distImport: "./dist/policy/index.js",
    distTypes: "./dist/policy/index.d.ts",
  },
  "./permission": {
    srcBarrel: "packages/kernel/src/permission/index.ts",
    distImport: "./dist/permission/index.js",
    distTypes: "./dist/permission/index.d.ts",
  },
  "./governance": {
    srcBarrel: "packages/kernel/src/governance/index.ts",
    distImport: "./dist/governance/index.js",
    distTypes: "./dist/governance/index.d.ts",
  },
} as const satisfies Record<string, KernelSubpathExportSpec>;

/** PAS-001 §6.4 — root `.` plus layout-contract subpath exports. */
export const PAS_64_REQUIRED_SUBPATHS = {
  ".": PAS_64_SUBPATH_BARRELS["."],
  "./context": PAS_64_SUBPATH_BARRELS["./context"],
  "./erp-domain/accounting": PAS_64_SUBPATH_BARRELS["./erp-domain/accounting"],
  "./propagation": PAS_64_SUBPATH_BARRELS["./propagation"],
  "./events": PAS_64_SUBPATH_BARRELS["./events"],
  "./policy": PAS_64_SUBPATH_BARRELS["./policy"],
  "./permission": PAS_64_SUBPATH_BARRELS["./permission"],
  "./governance": PAS_64_SUBPATH_BARRELS["./governance"],
} as const satisfies Record<string, KernelSubpathExportSpec>;

export interface KernelSubpathExportViolation {
  readonly message: string;
  readonly rule: string;
}

interface PackageExportEntry {
  readonly default?: string;
  readonly import?: string;
  readonly types?: string;
}

function readPackageExports(): Record<string, PackageExportEntry> {
  const packageJsonPath = join(repoRoot, "packages/kernel/package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    exports?: Record<string, PackageExportEntry>;
  };

  return packageJson.exports ?? {};
}

function exportEntryMatches(
  actual: PackageExportEntry | undefined,
  expected: KernelSubpathExportSpec
): string[] {
  const mismatches: string[] = [];

  if (!actual) {
    mismatches.push("missing export entry");
    return mismatches;
  }

  if (actual.types !== expected.distTypes) {
    mismatches.push(
      `types mismatch: expected ${expected.distTypes}, got ${actual.types ?? "(missing)"}`
    );
  }

  if (actual.import !== expected.distImport) {
    mismatches.push(
      `import mismatch: expected ${expected.distImport}, got ${actual.import ?? "(missing)"}`
    );
  }

  if (actual.default !== expected.distImport) {
    mismatches.push(
      `default mismatch: expected ${expected.distImport}, got ${actual.default ?? "(missing)"}`
    );
  }

  return mismatches;
}

export function checkKernelSubpathExports(): KernelSubpathExportViolation[] {
  const violations: KernelSubpathExportViolation[] = [];

  for (const subpath of KERNEL_PACKAGE_SUBPATH_EXPORTS) {
    if (!(subpath in PAS_64_REQUIRED_SUBPATHS)) {
      violations.push({
        rule: "layout-contract-drift",
        message: `kernel-package-layout.contract.ts subpath ${subpath} missing from PAS_64_REQUIRED_SUBPATHS`,
      });
    }
  }

  const packageExports = readPackageExports();
  const requiredKeys = Object.keys(PAS_64_REQUIRED_SUBPATHS);
  const actualKeys = Object.keys(packageExports).sort();
  const expectedKeys = [...requiredKeys].sort();

  if (actualKeys.length !== expectedKeys.length) {
    violations.push({
      rule: "export-key-count",
      message: `packages/kernel/package.json exports must have exactly ${expectedKeys.length} keys; found ${actualKeys.length}: ${actualKeys.join(", ")}`,
    });
  }

  for (const key of expectedKeys) {
    if (!(key in packageExports)) {
      violations.push({
        rule: "export-key-missing",
        message: `packages/kernel/package.json missing export key: ${key}`,
      });
    }
  }

  for (const key of actualKeys) {
    if (!(key in PAS_64_REQUIRED_SUBPATHS)) {
      violations.push({
        rule: "export-key-extra",
        message: `packages/kernel/package.json has unapproved export key: ${key}`,
      });
    }
  }

  for (const [key, spec] of Object.entries(PAS_64_REQUIRED_SUBPATHS)) {
    const entryMismatches = exportEntryMatches(packageExports[key], spec);
    for (const mismatch of entryMismatches) {
      violations.push({
        rule: "export-entry-mismatch",
        message: `${key}: ${mismatch}`,
      });
    }

    const srcPath = join(repoRoot, spec.srcBarrel);
    if (!existsSync(srcPath)) {
      violations.push({
        rule: "src-barrel-missing",
        message: `missing src barrel: ${spec.srcBarrel}`,
      });
    }
  }

  const subpathTestPath = join(
    repoRoot,
    "packages/kernel/src/__tests__/subpath-exports.test.ts"
  );
  if (existsSync(subpathTestPath)) {
    const testSource = readFileSync(subpathTestPath, "utf8");
    for (const key of requiredKeys) {
      if (!testSource.includes(key)) {
        violations.push({
          rule: "subpath-test-coverage",
          message: `subpath-exports.test.ts must mention subpath key: ${key}`,
        });
      }
    }

    if (!/PAS\s*§?\s*6\.4|6\.4/.test(testSource)) {
      violations.push({
        rule: "subpath-test-pas-reference",
        message:
          "subpath-exports.test.ts must document PAS §6.4 required subpath keys",
      });
    }
  } else {
    violations.push({
      rule: "subpath-test-missing",
      message: "missing packages/kernel/src/__tests__/subpath-exports.test.ts",
    });
  }

  return violations;
}

export function formatKernelSubpathExportViolations(
  violations: readonly KernelSubpathExportViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  const lines = ["Kernel subpath export gate failed:"];
  for (const violation of violations) {
    lines.push(`  - [${violation.rule}] ${violation.message}`);
  }
  return lines.join("\n");
}

function main(): void {
  const violations = checkKernelSubpathExports();
  if (violations.length > 0) {
    console.error(formatKernelSubpathExportViolations(violations));
    process.exit(1);
  }

  console.log("Kernel subpath export gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-kernel-subpath-exports.mts")
    );
  } catch {
    return entry.endsWith("check-kernel-subpath-exports.mts");
  }
})();

if (isDirectRun) {
  main();
}
