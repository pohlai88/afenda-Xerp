#!/usr/bin/env tsx
import { collectModuleReadinessFailures } from "../../packages/erp-module-foundation/src/assert-module-readiness.js";
import {
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-metadata-binding";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const bundle = PROCUREMENT_FOUNDATION_BUNDLE;

  for (const surface of bundle.metadataBinding.surfaces) {
    if (!surface.operatingContextRequired) {
      violations.push({
        rule: "metadata-context-required",
        file: GATE,
        message: `surface "${surface.surfaceId}" must require operating context`,
      });
    }
    if (!surface.routeKind) {
      violations.push({
        rule: "metadata-route-kind",
        file: GATE,
        message: `surface "${surface.surfaceId}" missing routeKind`,
      });
    }
  }

  const metadataFailures = collectModuleReadinessFailures(bundle).filter(
    (f) => f.includes("metadata")
  );
  for (const failure of metadataFailures) {
    violations.push({ rule: "metadata-readiness", file: GATE, message: failure });
  }

  return violations;
}

reportViolations(GATE, run());
