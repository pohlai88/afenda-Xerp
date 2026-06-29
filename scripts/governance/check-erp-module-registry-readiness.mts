#!/usr/bin/env tsx
import { assertErpRuntimeModuleRegistry } from "../../packages/erp-module-foundation/src/assert-module-registry-readiness.js";
import {
  type ErpModuleFoundationViolation,
  buildReferenceRegistryBundle,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-registry-readiness";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];

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
