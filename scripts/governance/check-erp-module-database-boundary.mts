#!/usr/bin/env tsx
import {
  type ErpModuleFoundationViolation,
  PROCUREMENT_FOUNDATION_BUNDLE,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:erp-module-database-boundary";

function run(): readonly ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const status = PROCUREMENT_FOUNDATION_BUNDLE.module.runtimeStatus;
  const boundary = PROCUREMENT_FOUNDATION_BUNDLE.databaseBoundary;

  if (status === "runtime_authorized" || status === "runtime_verified") {
    if (!boundary) {
      violations.push({
        rule: "database-boundary-required",
        file: GATE,
        message: "runtime status requires databaseBoundary artifact",
      });
      return violations;
    }

    for (const table of boundary.tables) {
      if (!table.tenantScoped) {
        violations.push({
          rule: "database-tenant-scope",
          file: GATE,
          message: `table "${table.tableName}" must be tenantScoped`,
        });
      }
      if (!table.migrationPath) {
        violations.push({
          rule: "database-migration",
          file: GATE,
          message: `table "${table.tableName}" missing migrationPath`,
        });
      }
    }
  }

  return violations;
}

reportViolations(GATE, run());
