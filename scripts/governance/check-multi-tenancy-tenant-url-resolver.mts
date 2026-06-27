#!/usr/bin/env tsx
/**
 * Multi-tenancy tenant URL resolver gate (multi-tenancy.md Step 6, §553–559).
 *
 * Authoritative for host parsing, reserved subdomains, tenant slug resolution,
 * legal-entity boundary, and CSP/correlation/auth preservation in proxy.ts.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  MULTI_TENANCY_DOC_REFERENCE,
} from "./delivery-evidence-surface-registry.mts";
import {
  collectTenantUrlResolverViolations,
  type TenantUrlResolverEnforcementViolation,
} from "./lib/multi-tenancy-tenant-url-resolver-enforcement.mts";
import {
  MULTI_TENANCY_DOC_TENANT_URL_RESOLVER_MARKERS,
  MULTI_TENANCY_TENANT_URL_RESOLVER_ENFORCEMENT_LIB,
  MULTI_TENANCY_TENANT_URL_RESOLVER_GATE,
  MULTI_TENANCY_TENANT_URL_RESOLVER_SURFACE_RULE,
  TIP_007_012_TENANT_URL_RESOLVER_SECTION,
} from "./multi-tenancy-tenant-url-resolver-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-tenant-url-resolver-registry.mts"
);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyTenantUrlResolverViolation =
  TenantUrlResolverEnforcementViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyTenantUrlResolver(): MultiTenancyTenantUrlResolverViolation[] {
  const violations: MultiTenancyTenantUrlResolverViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "multi-tenancy-tenant-url-resolver-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (
    !registrySource.includes(MULTI_TENANCY_TENANT_URL_RESOLVER_SURFACE_RULE)
  ) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_TENANT_URL_RESOLVER_SURFACE_RULE}`,
    });
  }

  const enforcementLibPath = join(
    repoRoot,
    MULTI_TENANCY_TENANT_URL_RESOLVER_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, MULTI_TENANCY_TENANT_URL_RESOLVER_GATE);

  if (!existsSync(enforcementLibPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementLibPath,
      message: `${MULTI_TENANCY_TENANT_URL_RESOLVER_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_TENANT_URL_RESOLVER_GATE} is required`,
    });
  }

  const multiTenancyContent = readText(multiTenancyDocPath);
  if (multiTenancyContent === null) {
    violations.push({
      rule: "multi-tenancy-doc-missing",
      file: multiTenancyDocPath,
      message: `${MULTI_TENANCY_DOC_REFERENCE} is required`,
    });
  } else {
    for (const marker of MULTI_TENANCY_DOC_TENANT_URL_RESOLVER_MARKERS) {
      if (!multiTenancyContent.includes(marker)) {
        violations.push({
          rule: "doc-marker-missing",
          file: multiTenancyDocPath,
          message: `Missing Step 6 marker: ${marker}`,
        });
      }
    }
  }


  const packageJsonContent = readText(packageJsonPath);
  if (packageJsonContent === null) {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "root package.json is required",
    });
  } else {
    if (
      !packageJsonContent.includes("check:multi-tenancy-tenant-url-resolver")
    ) {
      violations.push({
        rule: "check-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define check:multi-tenancy-tenant-url-resolver",
      });
    }

    if (
      !packageJsonContent.includes("quality:multi-tenancy-tenant-url-resolver")
    ) {
      violations.push({
        rule: "quality-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define quality:multi-tenancy-tenant-url-resolver",
      });
    }

    const qualityChainMatch = packageJsonContent.match(
      /"quality":\s*"([^"]+)"/
    );
    const qualityChain = qualityChainMatch?.[1] ?? "";
    const glossaryIndex = qualityChain.indexOf(
      "quality:multi-tenancy-glossary-first"
    );
    const auditIndex = qualityChain.indexOf(
      "quality:multi-tenancy-existing-state-audit"
    );
    const authorityIndex = qualityChain.indexOf(
      "quality:multi-tenancy-authority-design"
    );
    const contextContractsIndex = qualityChain.indexOf(
      "quality:multi-tenancy-context-contracts"
    );
    const persistenceIndex = qualityChain.indexOf(
      "quality:multi-tenancy-persistence-lookup"
    );
    const tenantUrlIndex = qualityChain.indexOf(
      "quality:multi-tenancy-tenant-url-resolver"
    );
    const operatingResolverIndex = qualityChain.indexOf(
      "quality:multi-tenancy-operating-context-resolver"
    );
    const dosIndex = qualityChain.indexOf(
      "quality:multi-tenancy-dos-prohibitions"
    );

    if (
      glossaryIndex === -1 ||
      auditIndex === -1 ||
      authorityIndex === -1 ||
      contextContractsIndex === -1 ||
      persistenceIndex === -1 ||
      tenantUrlIndex === -1 ||
      operatingResolverIndex === -1 ||
      dosIndex === -1 ||
      glossaryIndex > auditIndex ||
      auditIndex > authorityIndex ||
      authorityIndex > contextContractsIndex ||
      contextContractsIndex > persistenceIndex ||
      persistenceIndex > tenantUrlIndex ||
      tenantUrlIndex > operatingResolverIndex ||
      operatingResolverIndex > dosIndex
    ) {
      violations.push({
        rule: "quality-chain-order",
        file: packageJsonPath,
        message:
          "quality:multi-tenancy-glossary-first → existing-state-audit → authority-design → context-contracts → persistence-lookup → tenant-url-resolver → operating-context-resolver → dos-prohibitions order required in pnpm quality",
      });
    }
  }

  violations.push(...collectTenantUrlResolverViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyTenantUrlResolverViolations(
  violations: readonly MultiTenancyTenantUrlResolverViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyTenantUrlResolver();
  if (violations.length > 0) {
    console.error(formatMultiTenancyTenantUrlResolverViolations(violations));
    process.exit(1);
  }

  console.log("Multi-tenancy tenant URL resolver gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-tenant-url-resolver.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-tenant-url-resolver.mts");
  }
})();

if (isDirectRun) {
  main();
}
