#!/usr/bin/env tsx
import { collectModuleReadinessFailures } from "../../packages/erp-module-foundation/src/assert-module-readiness.js";
import {
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-ownership";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const bundle = PROCUREMENT_FOUNDATION_BUNDLE;
  const { module, ownership } = bundle;

  if (!module.wirePackage.startsWith(`${ownership.wireVocabulary}/`)) {
    violations.push({
      rule: "ownership-wire",
      file: GATE,
      message: "wireVocabulary does not prefix wirePackage",
    });
  }

  if (ownership.runtimeBehavior !== module.ownerPackage) {
    violations.push({
      rule: "ownership-runtime",
      file: GATE,
      message: "runtimeBehavior !== ownerPackage",
    });
  }

  if (ownership.databaseSchema !== module.databaseOwner) {
    violations.push({
      rule: "ownership-database",
      file: GATE,
      message: "databaseSchema !== databaseOwner",
    });
  }

  if (ownership.permissionRegistry !== module.permissionOwner) {
    violations.push({
      rule: "ownership-permissions",
      file: GATE,
      message: "permissionRegistry !== permissionOwner",
    });
  }

  const ownershipFailures = collectModuleReadinessFailures(bundle).filter((f) =>
    f.includes("ownership")
  );
  for (const failure of ownershipFailures) {
    violations.push({
      rule: "ownership-readiness",
      file: GATE,
      message: failure,
    });
  }

  return violations;
}

reportViolations(GATE, run());
