#!/usr/bin/env tsx
/**
 * ERP-PROC-OP-006 — procurement audit/outbox declaration drift gate.
 * Asserts features contract matches kernel vocabulary and foundation bundle;
 * no audit/outbox writer runtime on disk until authorized slice.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { PROCUREMENT_FOUNDATION_BUNDLE } from "../../packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts";
import {
  PROCUREMENT_AUDIT_OUTBOX_CONTRACT,
  PROCUREMENT_MODULE_PREFIXED_AUDIT_ACTIONS,
  PROCUREMENT_PLANNED_OUTBOX_ENTRIES,
  PROCUREMENT_WIRE_AUDIT_ACTIONS,
} from "../../packages/features/erp-modules/src/procurement/procurement.audit-outbox.contract.ts";
import { PROCUREMENT_AUDIT_ACTIONS } from "../../packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts";
import {
  type ErpModuleFoundationViolation,
  getRepoRoot,
  pathExists,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:procurement-audit-outbox-contract";
const RUNTIME_PACKAGE_PATH = "packages/procurement";
const FEATURES_PROCUREMENT_PATH =
  "packages/features/erp-modules/src/procurement";
const EXPECTED_AUDIT_ACTION_COUNT = 13;

const FORBIDDEN_WRITER_PATTERNS = [
  /writeProcurementAudit/i,
  /procurementAuditWriter/i,
  /procurementOutboxWriter/i,
  /publishProcurementOutbox/i,
] as const;

function sorted(values: readonly string[]): string[] {
  return [...values].sort((left, right) => left.localeCompare(right));
}

export function checkProcurementAuditOutboxContract(): ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const contract = PROCUREMENT_AUDIT_OUTBOX_CONTRACT;
  const bundle = PROCUREMENT_FOUNDATION_BUNDLE;
  const kernelActions = sorted(PROCUREMENT_AUDIT_ACTIONS);
  const wireActions = sorted(contract.wireAuditActions);
  const prefixedActions = sorted(contract.modulePrefixedAuditActions);
  const bundleAuditActions = sorted(bundle.auditMap.actions);
  const bundleEvents = sorted(bundle.eventCatalog.events);
  const outboxEvents = sorted(
    bundle.outboxContract.entries.map((entry) => entry.event)
  );

  if (wireActions.length !== EXPECTED_AUDIT_ACTION_COUNT) {
    violations.push({
      rule: "wire-audit-count",
      file: GATE,
      message: `expected ${EXPECTED_AUDIT_ACTION_COUNT} wire audit actions — got ${wireActions.length}`,
    });
  }

  if (kernelActions.join("|") !== wireActions.join("|")) {
    violations.push({
      rule: "kernel-audit-parity",
      file: GATE,
      message:
        "PROCUREMENT_AUDIT_OUTBOX_CONTRACT.wireAuditActions !== PROCUREMENT_AUDIT_ACTIONS",
    });
  }

  if (sorted(PROCUREMENT_WIRE_AUDIT_ACTIONS).join("|") !== wireActions.join("|")) {
    violations.push({
      rule: "export-wire-parity",
      file: GATE,
      message:
        "PROCUREMENT_WIRE_AUDIT_ACTIONS export !== contract wireAuditActions",
    });
  }

  if (
    sorted(PROCUREMENT_MODULE_PREFIXED_AUDIT_ACTIONS).join("|") !==
    prefixedActions.join("|")
  ) {
    violations.push({
      rule: "prefixed-export-parity",
      file: GATE,
      message: "modulePrefixedAuditActions export drift",
    });
  }

  if (bundleAuditActions.join("|") !== prefixedActions.join("|")) {
    violations.push({
      rule: "bundle-audit-drift",
      file: GATE,
      message:
        "PROCUREMENT_FOUNDATION_BUNDLE.auditMap.actions !== features audit/outbox contract",
    });
  }

  if (contract.auditWriterStatus !== "deferred") {
    violations.push({
      rule: "audit-writer-deferred",
      file: GATE,
      message: `auditWriterStatus must be "deferred"`,
    });
  }

  if (contract.outboxWriterStatus !== "deferred") {
    violations.push({
      rule: "outbox-writer-deferred",
      file: GATE,
      message: `outboxWriterStatus must be "deferred"`,
    });
  }

  const plannedEvents = sorted(
    PROCUREMENT_PLANNED_OUTBOX_ENTRIES.map((entry) => entry.event)
  );

  if (plannedEvents.join("|") !== outboxEvents.join("|")) {
    violations.push({
      rule: "bundle-outbox-drift",
      file: GATE,
      message:
        "PROCUREMENT_FOUNDATION_BUNDLE.outboxContract.entries !== plannedOutboxEntries",
    });
  }

  for (const event of outboxEvents) {
    if (!bundleEvents.includes(event)) {
      violations.push({
        rule: "outbox-catalog",
        file: GATE,
        message: `outbox event "${event}" missing from event catalog`,
      });
    }

    const entry = bundle.outboxContract.entries.find(
      (candidate) => candidate.event === event
    );
    if (entry?.requirement !== "deferred") {
      violations.push({
        rule: "outbox-requirement-deferred",
        file: GATE,
        message: `outbox event "${event}" must have requirement "deferred"`,
      });
    }
  }

  const repoRoot = getRepoRoot();
  const featuresPath = join(repoRoot, FEATURES_PROCUREMENT_PATH);

  if (pathExists(featuresPath)) {
    for (const fileName of readdirSync(featuresPath)) {
      if (!fileName.endsWith(".server.ts") || fileName.includes(".test.")) {
        continue;
      }

      const source = readFileSync(join(featuresPath, fileName), "utf8");
      for (const pattern of FORBIDDEN_WRITER_PATTERNS) {
        if (pattern.test(source)) {
          violations.push({
            rule: "no-premature-audit-outbox-writer",
            file: GATE,
            message: `${FEATURES_PROCUREMENT_PATH}/${fileName} contains forbidden writer pattern ${pattern.source}`,
          });
        }
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
      `  audit/outbox contract OK: ${EXPECTED_AUDIT_ACTION_COUNT} wire actions · ${PROCUREMENT_PLANNED_OUTBOX_ENTRIES.length} deferred outbox entries · no writers`
    );
  }

  return violations;
}

function run(): readonly ErpModuleFoundationViolation[] {
  return checkProcurementAuditOutboxContract();
}

reportViolations(GATE, run());
