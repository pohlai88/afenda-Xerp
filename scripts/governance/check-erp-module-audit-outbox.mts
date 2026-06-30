#!/usr/bin/env tsx
import { collectModuleReadinessFailures } from "../../packages/erp-module-foundation/src/assert-module-readiness.js";
import {
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-audit-outbox";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const bundle = PROCUREMENT_FOUNDATION_BUNDLE;
  const catalogEvents = new Set(bundle.eventCatalog.events);

  for (const entry of bundle.outboxContract.entries) {
    if (!catalogEvents.has(entry.event)) {
      violations.push({
        rule: "outbox-catalog",
        file: GATE,
        message: `outbox event "${entry.event}" missing from event catalog`,
      });
    }
  }

  for (const action of bundle.auditMap.actions) {
    if (!action.startsWith(`${bundle.module.slug}.`)) {
      violations.push({
        rule: "audit-namespace",
        file: GATE,
        message: `audit action "${action}" must be module-prefixed`,
      });
    }
  }

  const auditFailures = collectModuleReadinessFailures(bundle).filter(
    (f) => f.includes("outbox") || f.includes("audit")
  );
  for (const failure of auditFailures) {
    violations.push({
      rule: "audit-outbox-readiness",
      file: GATE,
      message: failure,
    });
  }

  return violations;
}

reportViolations(GATE, run());
