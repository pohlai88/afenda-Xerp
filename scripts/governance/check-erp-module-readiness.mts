#!/usr/bin/env tsx
import { assertModuleReadiness } from "../../packages/erp-module-foundation/src/assert-module-readiness.js";
import { assertErpRuntimeModuleRegistry } from "../../packages/erp-module-foundation/src/assert-module-registry-readiness.js";
import {
  buildReferenceRegistryBundle,
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  reportViolations,
  validateEvidencePath,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-readiness";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];

  try {
    assertModuleReadiness(PROCUREMENT_FOUNDATION_BUNDLE, {
      validateEvidencePaths: true,
      evidencePathValidator: validateEvidencePath,
    });
  } catch (error) {
    violations.push({
      rule: "module-readiness",
      file: GATE,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    assertErpRuntimeModuleRegistry(buildReferenceRegistryBundle());
  } catch (error) {
    violations.push({
      rule: "registry-readiness",
      file: GATE,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  return violations;
}

reportViolations(GATE, run());
