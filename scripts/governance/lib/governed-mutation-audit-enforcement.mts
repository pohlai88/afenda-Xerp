/**
 * Governed mutation audit enforcement — PKG013_AUDIT / `quality:erp-observability`.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import {
  GOVERNED_MUTATION_API_AUDIT_MODULES,
  GOVERNED_MUTATION_AUDIT_EMISSION_SYMBOLS,
  GOVERNED_MUTATION_SERVER_ACTION_MODULES,
} from "../../../packages/observability/src/surface/governed-mutation-audit-registry.ts";

export interface GovernedMutationAuditViolation {
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

function collectApiAuditWiringViolations(
  repoRoot: string
): GovernedMutationAuditViolation[] {
  const violations: GovernedMutationAuditViolation[] = [];

  for (const module of GOVERNED_MUTATION_API_AUDIT_MODULES) {
    const absolutePath = join(repoRoot, module.path);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "api-audit-module-missing",
        file: module.path,
        message: `Governed mutation API audit module missing: ${module.path}`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    for (const symbol of module.requiredSymbols) {
      if (!source.includes(symbol)) {
        violations.push({
          rule: "api-audit-symbol-missing",
          file: module.path,
          message: `${module.path} must reference ${symbol} for governed mutation audit wiring`,
        });
      }
    }
  }

  return violations;
}

function collectServerActionAuditViolations(
  repoRoot: string
): GovernedMutationAuditViolation[] {
  const violations: GovernedMutationAuditViolation[] = [];

  for (const module of GOVERNED_MUTATION_SERVER_ACTION_MODULES) {
    const absolutePath = join(repoRoot, module.path);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "server-action-module-missing",
        file: module.path,
        message: `Governed mutation server action missing: ${module.path}`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    if (!module.auditRequired) {
      if (
        module.auditExemptionReason === undefined ||
        module.auditExemptionReason.length === 0
      ) {
        violations.push({
          rule: "server-action-exemption-reason-missing",
          file: module.path,
          message: `${module.path} is audit-exempt but missing auditExemptionReason in registry`,
        });
      }
      continue;
    }

    if (
      !sourceContainsAnySymbol(source, GOVERNED_MUTATION_AUDIT_EMISSION_SYMBOLS)
    ) {
      violations.push({
        rule: "server-action-audit-missing",
        file: module.path,
        message: `${module.path} (${module.action}) must emit audit via recordActionAudit, recordErpAuditEvent, or withAuditEvidence before success`,
      });
      continue;
    }

    for (const symbol of module.requiredSymbols) {
      if (!source.includes(symbol)) {
        violations.push({
          rule: "server-action-audit-symbol-missing",
          file: module.path,
          message: `${module.path} must reference ${symbol} for governed mutation audit`,
        });
      }
    }

    const successIndex = source.indexOf("serverActionSuccess");
    if (successIndex === -1) {
      violations.push({
        rule: "server-action-success-missing",
        file: module.path,
        message: `${module.path} is registered as audit-required but has no serverActionSuccess path`,
      });
      continue;
    }

    const auditIndex = Math.min(
      ...GOVERNED_MUTATION_AUDIT_EMISSION_SYMBOLS.map((symbol) =>
        source.indexOf(symbol)
      ).filter((index) => index >= 0)
    );

    if (auditIndex === Number.POSITIVE_INFINITY || auditIndex >= successIndex) {
      violations.push({
        rule: "server-action-audit-order",
        file: module.path,
        message: `${module.path} must emit audit evidence before serverActionSuccess`,
      });
    }
  }

  return violations;
}

const ERP_SRC_ROOT = "apps/erp/src";

function collectErpSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...collectErpSourceFiles(absolutePath));
      continue;
    }

    if (/\.(?:tsx?|jsx?)$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function isGovernedServerActionMutationSource(source: string): boolean {
  return (
    source.includes('"use server"') && source.includes("serverActionSuccess")
  );
}

/** Discovered ERP server-action paths that perform governed success mutations. */
export function discoverGovernedServerActionMutationPaths(
  repoRoot: string
): string[] {
  const erpSrcRoot = join(repoRoot, ERP_SRC_ROOT);

  if (!existsSync(erpSrcRoot)) {
    return [];
  }

  const discovered: string[] = [];

  for (const absolutePath of collectErpSourceFiles(erpSrcRoot)) {
    const source = readFileSync(absolutePath, "utf8");

    if (!isGovernedServerActionMutationSource(source)) {
      continue;
    }

    discovered.push(relative(repoRoot, absolutePath).replaceAll("\\", "/"));
  }

  return discovered.sort();
}

export function collectUnregisteredServerActionMutationViolations(
  repoRoot: string
): GovernedMutationAuditViolation[] {
  const registeredPaths = new Set(
    GOVERNED_MUTATION_SERVER_ACTION_MODULES.map((module) => module.path)
  );

  const violations: GovernedMutationAuditViolation[] = [];

  for (const path of discoverGovernedServerActionMutationPaths(repoRoot)) {
    if (registeredPaths.has(path)) {
      continue;
    }

    violations.push({
      rule: "server-action-unregistered-mutation",
      file: path,
      message: `${path} contains "use server" and serverActionSuccess but is not listed in GOVERNED_MUTATION_SERVER_ACTION_MODULES — register with auditRequired or auditExemptionReason`,
    });
  }

  return violations;
}

export async function collectApiContractAuditPolicyViolations(
  repoRoot: string
): Promise<GovernedMutationAuditViolation[]> {
  const violations: GovernedMutationAuditViolation[] = [];

  const [apiContractRegistry, methodPolicy] = await Promise.all([
    import(
      new URL(
        "../../../apps/erp/src/server/api/contracts/api-contract-registry.ts",
        import.meta.url
      ).href
    ),
    import(
      new URL(
        "../../../apps/erp/src/server/api/contracts/method-policy.contract.ts",
        import.meta.url
      ).href
    ),
  ]);

  for (const contract of apiContractRegistry.API_CONTRACTS) {
    try {
      methodPolicy.assertMethodPolicy(contract);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      violations.push({
        rule: "api-contract-audit-policy",
        file: "apps/erp/src/server/api/contracts/api-contract-registry.ts",
        message: `${contract.id}: ${message}`,
      });
    }
  }

  return violations;
}

export function collectGovernedMutationAuditViolations(
  repoRoot: string
): GovernedMutationAuditViolation[] {
  return [
    ...collectApiAuditWiringViolations(repoRoot),
    ...collectServerActionAuditViolations(repoRoot),
    ...collectUnregisteredServerActionMutationViolations(repoRoot),
  ];
}

export async function collectAllGovernedMutationAuditViolations(
  repoRoot: string
): Promise<GovernedMutationAuditViolation[]> {
  const contractViolations =
    await collectApiContractAuditPolicyViolations(repoRoot);

  return [
    ...collectGovernedMutationAuditViolations(repoRoot),
    ...contractViolations,
  ];
}
