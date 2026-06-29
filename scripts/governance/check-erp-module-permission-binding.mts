#!/usr/bin/env tsx
import {
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-permission-binding";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const binding = PROCUREMENT_FOUNDATION_BUNDLE.permissionBinding;
  const status = PROCUREMENT_FOUNDATION_BUNDLE.module.runtimeStatus;

  if (
    (status === "runtime_authorized" || status === "runtime_verified") &&
    binding.permissionParity !== "exact"
  ) {
    violations.push({
      rule: "permission-parity-runtime",
      file: GATE,
      message: `runtime status requires permissionParity exact — got ${binding.permissionParity}`,
    });
  }

  const permissionKeys = new Set(binding.kernelPermissionKeys);
  for (const surface of PROCUREMENT_FOUNDATION_BUNDLE.metadataBinding.surfaces) {
    if (!permissionKeys.has(surface.permissionKey)) {
      violations.push({
        rule: "permission-metadata-binding",
        file: GATE,
        message: `metadata surface "${surface.surfaceId}" permission missing from binding`,
      });
    }
  }

  return violations;
}

reportViolations(GATE, run());
