/**
 * Governed diagnostic logging enforcement — PKG013_LOGGING /
 * `pnpm check:erp-diagnostic-logging`.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  GOVERNED_DIAGNOSTIC_API_MODULES,
  GOVERNED_DIAGNOSTIC_LOGGING_EMISSION_SYMBOLS,
  GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES,
} from "../../../packages/observability/src/surface/governed-diagnostic-logging-registry.ts";
import { GOVERNED_MUTATION_SERVER_ACTION_MODULES } from "../../../packages/observability/src/surface/governed-mutation-audit-registry.ts";
import {
  collectUnregisteredServerActionMutationViolations,
  discoverGovernedServerActionMutationPaths,
} from "./governed-mutation-audit-enforcement.mts";

export interface GovernedDiagnosticLoggingViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function sourceContainsAnySymbol(
  source: string,
  symbols: readonly string[]
): boolean {
  return symbols.some((symbol) => source.includes(symbol));
}

function collectApiDiagnosticWiringViolations(
  repoRoot: string
): GovernedDiagnosticLoggingViolation[] {
  const violations: GovernedDiagnosticLoggingViolation[] = [];

  for (const module of GOVERNED_DIAGNOSTIC_API_MODULES) {
    const absolutePath = join(repoRoot, module.path);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "api-diagnostic-module-missing",
        file: module.path,
        message: `Governed diagnostic API module missing: ${module.path}`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    for (const symbol of module.requiredSymbols) {
      if (!source.includes(symbol)) {
        violations.push({
          rule: "api-diagnostic-symbol-missing",
          file: module.path,
          message: `${module.path} must reference ${symbol} for governed diagnostic logging wiring`,
        });
      }
    }
  }

  return violations;
}

function collectServerActionDiagnosticViolations(
  repoRoot: string
): GovernedDiagnosticLoggingViolation[] {
  const violations: GovernedDiagnosticLoggingViolation[] = [];

  for (const module of GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES) {
    const absolutePath = join(repoRoot, module.path);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "server-action-module-missing",
        file: module.path,
        message: `Governed diagnostic server action missing: ${module.path}`,
      });
      continue;
    }

    const actionSource = readFileSync(absolutePath, "utf8");
    const loggingWiringPath =
      "loggingWiringPath" in module &&
      typeof module.loggingWiringPath === "string"
        ? module.loggingWiringPath
        : undefined;
    const wiringSource =
      loggingWiringPath === undefined
        ? actionSource
        : readFileSync(join(repoRoot, loggingWiringPath), "utf8");

    if (!module.loggingRequired) {
      if (
        module.loggingExemptionReason === undefined ||
        module.loggingExemptionReason.length === 0
      ) {
        violations.push({
          rule: "server-action-logging-exemption-reason-missing",
          file: module.path,
          message: `${module.path} is logging-exempt but missing loggingExemptionReason in registry`,
        });
      }
      continue;
    }

    if (
      !sourceContainsAnySymbol(wiringSource, [
        ...GOVERNED_DIAGNOSTIC_LOGGING_EMISSION_SYMBOLS,
        "failServerAction",
      ])
    ) {
      violations.push({
        rule: "server-action-diagnostic-missing",
        file: loggingWiringPath ?? module.path,
        message: `${loggingWiringPath ?? module.path} (${module.action}) must emit diagnostic logging via failServerAction or approved logger symbols`,
      });
      continue;
    }

    for (const symbol of module.requiredSymbols) {
      if (!wiringSource.includes(symbol)) {
        violations.push({
          rule: "server-action-diagnostic-symbol-missing",
          file: loggingWiringPath ?? module.path,
          message: `${loggingWiringPath ?? module.path} must reference ${symbol} for governed diagnostic logging`,
        });
      }
    }
  }

  return violations;
}

function collectAuditRegistryPathParityViolations(): GovernedDiagnosticLoggingViolation[] {
  const auditPaths = GOVERNED_MUTATION_SERVER_ACTION_MODULES.map(
    (module) => module.path
  );
  const diagnosticPaths = GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES.map(
    (module) => module.path
  );

  if (auditPaths.join("\n") === diagnosticPaths.join("\n")) {
    return [];
  }

  return [
    {
      rule: "audit-registry-path-parity",
      file: "packages/observability/src/surface/governed-diagnostic-logging-registry.ts",
      message:
        "GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES paths must byte-align with GOVERNED_MUTATION_SERVER_ACTION_MODULES",
    },
  ];
}

function mapUnregisteredMutationViolations(
  repoRoot: string
): GovernedDiagnosticLoggingViolation[] {
  return collectUnregisteredServerActionMutationViolations(repoRoot).map(
    (violation) => ({
      rule: "server-action-unregistered-diagnostic-mutation",
      file: violation.file,
      message: violation.message.replace(
        "GOVERNED_MUTATION_SERVER_ACTION_MODULES",
        "GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES"
      ),
    })
  );
}

export function collectGovernedDiagnosticLoggingViolations(
  repoRoot: string
): GovernedDiagnosticLoggingViolation[] {
  return [
    ...collectAuditRegistryPathParityViolations(),
    ...collectApiDiagnosticWiringViolations(repoRoot),
    ...collectServerActionDiagnosticViolations(repoRoot),
    ...mapUnregisteredMutationViolations(repoRoot),
  ];
}

export { discoverGovernedServerActionMutationPaths };
