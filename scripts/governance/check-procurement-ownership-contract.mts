#!/usr/bin/env tsx
/**
 * ERP-PROC-OP-002 — procurement ownership contract drift gate.
 * Compares features-package PROCUREMENT_OWNERSHIP_CONTRACT to foundation bundle ownership.
 */

import { PROCUREMENT_FOUNDATION_BUNDLE } from "../../packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts";
import { MODULE_OWNERSHIP_SURFACES } from "../../packages/erp-module-foundation/src/erp-module-foundation.types.ts";
import { PROCUREMENT_OWNERSHIP_CONTRACT } from "../../packages/features/erp-modules/src/procurement/procurement.ownership.contract.ts";
import {
  type ErpModuleFoundationViolation,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:procurement-ownership-contract";

export function checkProcurementOwnershipContract(): ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const bundleOwnership = PROCUREMENT_FOUNDATION_BUNDLE.ownership;

  for (const surface of MODULE_OWNERSHIP_SURFACES) {
    const contractValue = PROCUREMENT_OWNERSHIP_CONTRACT[surface];
    const bundleValue = bundleOwnership[surface];

    if (contractValue !== bundleValue) {
      violations.push({
        rule: "ownership-surface-drift",
        file: GATE,
        message: `${surface}: contract "${contractValue}" !== bundle "${bundleValue}"`,
      });
    }
  }

  if (violations.length === 0) {
    console.log(
      `  ownership contract OK: ${MODULE_OWNERSHIP_SURFACES.length} surfaces match PROCUREMENT_FOUNDATION_BUNDLE.ownership`
    );
  }

  return violations;
}

function run(): readonly ErpModuleFoundationViolation[] {
  return checkProcurementOwnershipContract();
}

reportViolations(GATE, run());
