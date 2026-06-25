#!/usr/bin/env tsx
/**
 * ERP diagnostic logging governance gate (PKG013_LOGGING / ADR-0014).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { collectGovernedDiagnosticLoggingViolations } from "./lib/governed-diagnostic-logging-enforcement.mts";
import {
  GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE,
  GOVERNED_DIAGNOSTIC_LOGGING_GATE_SCRIPT,
} from "../../packages/observability/src/surface/governed-diagnostic-logging-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

function collectRegistryBootstrapViolations(): string[] {
  const violations: string[] = [];

  if (
    !existsSync(join(repoRoot, GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE))
  ) {
    violations.push(
      `${GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE} is required`
    );
  }

  if (!existsSync(join(repoRoot, GOVERNED_DIAGNOSTIC_LOGGING_GATE_SCRIPT))) {
    violations.push(`${GOVERNED_DIAGNOSTIC_LOGGING_GATE_SCRIPT} is required`);
  }

  const registrySource = readFileSync(
    join(
      repoRoot,
      "packages/observability/src/surface/governed-diagnostic-logging-registry.ts"
    ),
    "utf8"
  );

  if (
    !registrySource.includes("GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE")
  ) {
    violations.push(
      "governed-diagnostic-logging-registry.ts must declare GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE"
    );
  }

  return violations;
}

function main(): void {
  const violations: string[] = [
    ...collectRegistryBootstrapViolations(),
    ...collectGovernedDiagnosticLoggingViolations(repoRoot).map(
      (violation) => `${violation.file}: ${violation.message}`
    ),
  ];

  if (violations.length > 0) {
    console.error("ERP diagnostic logging governance failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log("ERP diagnostic logging governance passed");
}

main();
