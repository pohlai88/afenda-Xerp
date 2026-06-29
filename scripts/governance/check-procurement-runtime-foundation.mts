#!/usr/bin/env tsx
/**
 * ERP-PROC-FDN-001 — procurement runtime authority boundary attestation.
 * Verifies ADR-0031 Accepted, PKGR05_PROCUREMENT disposition, no premature filesystem.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { getFoundationDispositionEntry } from "../../packages/architecture-authority/src/data/foundation-disposition.registry.ts";
import {
  type ErpModuleFoundationViolation,
  getRepoRoot,
  pathExists,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:procurement-runtime-foundation";
const ADR_PATH = "docs/adr/ADR-0031-procurement-runtime-authority-boundary.md";
const REGISTRY_ENTRY_ID = "PKGR05_PROCUREMENT";
const RUNTIME_PACKAGE_PATH = "packages/procurement";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const repoRoot = getRepoRoot();
  const adrFullPath = join(repoRoot, ADR_PATH);

  if (!pathExists(ADR_PATH)) {
    violations.push({
      rule: "adr-exists",
      file: GATE,
      message: `${ADR_PATH} missing — ERP-PROC-FDN-001 not delivered`,
    });
    return violations;
  }

  const adrContent = readFileSync(adrFullPath, "utf8");
  if (!/\*\*Status\*\*\s*\|\s*Accepted/i.test(adrContent)) {
    violations.push({
      rule: "adr-accepted",
      file: GATE,
      message: `${ADR_PATH} must have Status Accepted`,
    });
  }

  const entry = getFoundationDispositionEntry(REGISTRY_ENTRY_ID);
  if (!entry) {
    violations.push({
      rule: "registry-entry",
      file: GATE,
      message: `${REGISTRY_ENTRY_ID} missing from foundation-disposition.registry.ts`,
    });
  } else {
    if (entry.packageId !== "PKG-R05") {
      violations.push({
        rule: "registry-package-id",
        file: GATE,
        message: `expected packageId PKG-R05 — got ${entry.packageId}`,
      });
    }
    if (entry.packageName !== "@afenda/procurement") {
      violations.push({
        rule: "registry-package-name",
        file: GATE,
        message: `expected packageName @afenda/procurement — got ${entry.packageName}`,
      });
    }
    if (entry.authority !== "ADR-0031") {
      violations.push({
        rule: "registry-authority",
        file: GATE,
        message: `expected authority ADR-0031 — got ${entry.authority}`,
      });
    }
  }

  if (pathExists(RUNTIME_PACKAGE_PATH)) {
    violations.push({
      rule: "no-premature-filesystem",
      file: GATE,
      message: `${RUNTIME_PACKAGE_PATH} exists — filesystem blocked until FDN-002A + explicit activation ADR`,
    });
  }

  if (violations.length === 0) {
    console.log(
      `  runtime foundation OK: ADR-0031 Accepted · ${REGISTRY_ENTRY_ID} · no ${RUNTIME_PACKAGE_PATH}/`
    );
  }

  return violations;
}

reportViolations(GATE, run());
