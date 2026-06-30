#!/usr/bin/env tsx
/**
 * ERP-PROC-OP-007 — procurement PAS-006 UI scaffold drift gate.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PROCUREMENT_FOUNDATION_BUNDLE } from "../../packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts";
import {
  PROCUREMENT_PAS006_UI_BLOCK_IDS,
  PROCUREMENT_PAS006_UI_CONTRACT,
  PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE,
  PROCUREMENT_REQUISITIONS_LIST_ROUTE,
} from "../../packages/features/erp-modules/src/procurement/procurement.pas006-ui.contract.ts";
import {
  type ErpModuleFoundationViolation,
  getRepoRoot,
  pathExists,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:procurement-pas006-ui-contract";
const RUNTIME_PACKAGE_PATH = "packages/procurement";

const ROUTE_FILES = [
  PROCUREMENT_REQUISITIONS_LIST_ROUTE.pagePath,
  PROCUREMENT_REQUISITIONS_LIST_ROUTE.loaderPath,
  PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE.pagePath,
  PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE.loaderPath,
] as const;

export function checkProcurementPas006UiContract(): ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const contract = PROCUREMENT_PAS006_UI_CONTRACT;
  const bundleSurfaces = PROCUREMENT_FOUNDATION_BUNDLE.metadataBinding.surfaces;

  if (contract.uiProofStatus !== "scaffold_attested") {
    violations.push({
      rule: "ui-proof-status",
      file: GATE,
      message: 'uiProofStatus must be "scaffold_attested"',
    });
  }

  if (contract.databaseBackedLists !== false) {
    violations.push({
      rule: "database-backed-lists",
      file: GATE,
      message: "databaseBackedLists must remain false until DB runtime slice",
    });
  }

  if (contract.permissionEnforcement !== "deferred") {
    violations.push({
      rule: "permission-enforcement-deferred",
      file: GATE,
      message: "permissionEnforcement must remain deferred",
    });
  }

  if (
    contract.blockIds.join("|") !==
    [...PROCUREMENT_PAS006_UI_BLOCK_IDS].join("|")
  ) {
    violations.push({
      rule: "block-id-export-drift",
      file: GATE,
      message: "PROCUREMENT_PAS006_UI_BLOCK_IDS export drift",
    });
  }

  for (const route of contract.routes) {
    const bundleSurface = bundleSurfaces.find(
      (surface) => surface.surfaceId === route.surfaceId
    );

    if (!bundleSurface) {
      violations.push({
        rule: "bundle-metadata-surface-missing",
        file: GATE,
        message: `metadataBinding surface "${route.surfaceId}" missing from bundle`,
      });
      continue;
    }

    if (bundleSurface.route !== route.routePattern) {
      violations.push({
        rule: "bundle-route-drift",
        file: GATE,
        message: `bundle route "${bundleSurface.route}" !== "${route.routePattern}"`,
      });
    }
  }

  const repoRoot = getRepoRoot();

  for (const relativePath of ROUTE_FILES) {
    if (!pathExists(relativePath)) {
      violations.push({
        rule: "route-file-missing",
        file: GATE,
        message: `${relativePath} missing — ERP-PROC-OP-007 consumer route required`,
      });
      continue;
    }

    if (relativePath.endsWith(".server.ts")) {
      const loaderSource = readFileSync(join(repoRoot, relativePath), "utf8");

      if (!loaderSource.includes("loadProtectedRequestOperatingContext")) {
        violations.push({
          rule: "loader-spine-delegate",
          file: GATE,
          message: `${relativePath} must call loadProtectedRequestOperatingContext`,
        });
      }
    }
  }

  if (pathExists(RUNTIME_PACKAGE_PATH)) {
    violations.push({
      rule: "no-premature-runtime-package",
      file: GATE,
      message: `${RUNTIME_PACKAGE_PATH} exists — filesystem blocked until authorized slice`,
    });
  }

  if (violations.length === 0) {
    console.log(
      `  PAS-006 UI scaffold OK: ${contract.routes.length} routes · ${contract.blockIds.length} blocks · fixture-backed · permission deferred`
    );
  }

  return violations;
}

function run(): readonly ErpModuleFoundationViolation[] {
  return checkProcurementPas006UiContract();
}

reportViolations(GATE, run());
