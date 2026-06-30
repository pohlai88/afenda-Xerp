#!/usr/bin/env tsx
/**
 * PAS-001C — foundation_authorized modules must not ship runtime package filesystem
 * before ADR-gated slice (ERP-PROC-FDN-001). Registry row must stay planned / no FS.
 */

import { packageByName } from "../../packages/architecture-authority/src/data/package-registry.data.ts";
import {
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  pathExists,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-runtime-package-reserved";

function runtimePackageToPath(runtimePackage: string): string {
  const slug = runtimePackage.replace(/^@afenda\//, "");
  return `packages/${slug}`;
}

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const { module } = PROCUREMENT_FOUNDATION_BUNDLE;
  const { runtimePackage, runtimeStatus, ownerPackage } = module;

  if (runtimeStatus !== "foundation_authorized") {
    return violations;
  }

  const registryEntry = packageByName.get(runtimePackage);

  if (!registryEntry) {
    violations.push({
      rule: "runtime-package-registry",
      file: GATE,
      message: `runtimePackage "${runtimePackage}" missing from architecture package registry`,
    });
    return violations;
  }

  if (registryEntry.lifecycle !== "planned") {
    violations.push({
      rule: "runtime-package-lifecycle",
      file: GATE,
      message: `expected lifecycle "planned" for reserved ${runtimePackage} — got "${registryEntry.lifecycle}"`,
    });
  }

  if (registryEntry.filesystemRequired) {
    violations.push({
      rule: "runtime-package-filesystem",
      file: GATE,
      message:
        "filesystemRequired must be false until ERP-PROC-FDN-001 ADR closes",
    });
  }

  const expectedPath = runtimePackageToPath(runtimePackage);
  if (pathExists(expectedPath)) {
    violations.push({
      rule: "runtime-package-premature",
      file: GATE,
      message: `${expectedPath} exists on disk before runtime ADR — remove or promote lifecycle`,
    });
  }

  if (ownerPackage !== runtimePackage) {
    violations.push({
      rule: "runtime-owner-parity",
      file: GATE,
      message: `ownerPackage "${ownerPackage}" must match runtimePackage "${runtimePackage}"`,
    });
  }

  if (violations.length === 0) {
    console.log(
      `  reserved OK: ${runtimePackage} → ${expectedPath} (planned, no filesystem) — ERP-PROC-FDN-001`
    );
  }

  return violations;
}

reportViolations(GATE, run());
