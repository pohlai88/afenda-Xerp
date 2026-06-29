#!/usr/bin/env tsx
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  ERP_MODULE_FOUNDATION_PACKAGE_ROOT,
  ERP_MODULE_FOUNDATION_PROHIBITED_DEPENDENCIES,
  type ErpModuleFoundationViolation,
  getRepoRoot,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-no-kernel-runtime-leak";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const packageJsonPath = join(
    getRepoRoot(),
    ERP_MODULE_FOUNDATION_PACKAGE_ROOT,
    "package.json"
  );
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    dependencies?: Record<string, string>;
  };

  const runtimeDependencies = Object.keys(packageJson.dependencies ?? {});
  if (runtimeDependencies.length > 0) {
    violations.push({
      rule: "zero-deps",
      file: packageJsonPath,
      message: `package must have zero runtime dependencies — found: ${runtimeDependencies.join(", ")}`,
    });
  }

  for (const prohibited of ERP_MODULE_FOUNDATION_PROHIBITED_DEPENDENCIES) {
    if (runtimeDependencies.includes(prohibited)) {
      violations.push({
        rule: "prohibited-dep",
        file: packageJsonPath,
        message: `prohibited dependency "${prohibited}"`,
      });
    }
  }

  const fingerprintPath = join(
    getRepoRoot(),
    ERP_MODULE_FOUNDATION_PACKAGE_ROOT,
    "src/index.ts"
  );
  const indexSource = readFileSync(fingerprintPath, "utf8");
  if (!indexSource.includes("ERP_MODULE_FOUNDATION-2026-06-30-v4")) {
    violations.push({
      rule: "fingerprint-v4",
      file: fingerprintPath,
      message: "authority fingerprint must be v4 for PAS-001C",
    });
  }

  return violations;
}

reportViolations(GATE, run());
