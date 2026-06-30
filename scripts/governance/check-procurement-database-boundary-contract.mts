#!/usr/bin/env tsx
/**
 * ERP-PROC-OP-003 — procurement database boundary declaration drift gate.
 * Asserts features-package contract is declared-only; no schema files or runtime package on disk.
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";

import { PROCUREMENT_DATABASE_BOUNDARY_CONTRACT } from "../../packages/features/erp-modules/src/procurement/procurement.database-boundary.contract.ts";
import {
  type ErpModuleFoundationViolation,
  getRepoRoot,
  pathExists,
  reportViolations,
} from "./erp-module-foundation-registry.mts";

const GATE = "check:procurement-database-boundary-contract";
const SCHEMA_DIR = "packages/database/src/schema";
const RUNTIME_PACKAGE_PATH = "packages/procurement";

const EXPECTED_TABLE_NAMES = [
  "suppliers",
  "purchase_requisitions",
  "purchase_orders",
  "procurement_rfqs",
] as const;

const FORBIDDEN_SCHEMA_PATTERN =
  /(?:purchase|procurement|supplier).*\.schema\.ts$/i;

export function checkProcurementDatabaseBoundaryContract(): ErpModuleFoundationViolation[] {
  const violations: ErpModuleFoundationViolation[] = [];
  const repoRoot = getRepoRoot();
  const declaredNames = PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.tables.map(
    (table) => table.tableName
  );

  for (const expected of EXPECTED_TABLE_NAMES) {
    if (!declaredNames.includes(expected)) {
      violations.push({
        rule: "planned-table-missing",
        file: GATE,
        message: `expected planned table "${expected}" missing from PROCUREMENT_DATABASE_BOUNDARY_CONTRACT`,
      });
    }
  }

  if (declaredNames.length !== EXPECTED_TABLE_NAMES.length) {
    violations.push({
      rule: "planned-table-count",
      file: GATE,
      message: `expected ${EXPECTED_TABLE_NAMES.length} planned tables — got ${declaredNames.length}`,
    });
  }

  for (const table of PROCUREMENT_DATABASE_BOUNDARY_CONTRACT.tables) {
    if (table.migrationStatus !== "deferred") {
      violations.push({
        rule: "migration-status-deferred",
        file: GATE,
        message: `table "${table.tableName}" migrationStatus must be "deferred" — got "${table.migrationStatus}"`,
      });
    }
  }

  const schemaPath = join(repoRoot, SCHEMA_DIR);
  const schemaFiles = readdirSync(schemaPath).filter((file) =>
    file.endsWith(".schema.ts")
  );
  const forbiddenSchemaFiles = schemaFiles.filter((file) =>
    FORBIDDEN_SCHEMA_PATTERN.test(file)
  );

  if (forbiddenSchemaFiles.length > 0) {
    violations.push({
      rule: "no-procurement-schema-files",
      file: GATE,
      message: `procurement schema files must not exist until authorized migration slice: ${forbiddenSchemaFiles.join(", ")}`,
    });
  }

  if (pathExists(RUNTIME_PACKAGE_PATH)) {
    violations.push({
      rule: "no-premature-runtime-package",
      file: GATE,
      message: `${RUNTIME_PACKAGE_PATH} exists — filesystem blocked until authorized ERP-MODULES slice handoff`,
    });
  }

  if (violations.length === 0) {
    console.log(
      `  database boundary contract OK: ${EXPECTED_TABLE_NAMES.length} planned tables deferred · no procurement schema files · no ${RUNTIME_PACKAGE_PATH}/`
    );
  }

  return violations;
}

function run(): readonly ErpModuleFoundationViolation[] {
  return checkProcurementDatabaseBoundaryContract();
}

reportViolations(GATE, run());
