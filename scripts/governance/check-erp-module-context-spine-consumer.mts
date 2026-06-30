#!/usr/bin/env tsx
import { collectModuleStatusRequirementFailures } from "../../packages/erp-module-foundation/src/assert-module-status-requirements.js";
import {
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-context-spine-consumer";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const consumer = PROCUREMENT_FOUNDATION_BUNDLE.contextSpineConsumer;

  if (!consumer) {
    violations.push({
      rule: "context-spine-missing",
      file: GATE,
      message: "contextSpineConsumer artifact is missing",
    });
    return violations;
  }

  if (consumer.requiredResolvers.length === 0) {
    violations.push({
      rule: "context-spine-resolvers",
      file: GATE,
      message: "requiredResolvers must not be empty",
    });
  }

  if (consumer.forbiddenIngress.length === 0) {
    violations.push({
      rule: "context-spine-forbidden",
      file: GATE,
      message: "forbiddenIngress must not be empty",
    });
  }

  for (const failure of collectModuleStatusRequirementFailures(
    PROCUREMENT_FOUNDATION_BUNDLE
  ).filter((f) => f.includes("contextSpine"))) {
    violations.push({
      rule: "context-spine-status",
      file: GATE,
      message: failure,
    });
  }

  return violations;
}

reportViolations(GATE, run());
