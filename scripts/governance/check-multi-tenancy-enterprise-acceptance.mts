#!/usr/bin/env tsx
/**
 * Multi-tenancy enterprise acceptance gate (multi-tenancy.md §612–666).
 *
 * Authoritative for slice-completion matrix — maps each acceptance bullet to
 * delegated governance gates and contract test evidence.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  MULTI_TENANCY_DOC_REFERENCE,
} from "./delivery-evidence-surface-registry.mts";
import {
  collectEnterpriseAcceptanceViolations,
  type EnterpriseAcceptanceEnforcementViolation,
} from "./lib/multi-tenancy-enterprise-acceptance-enforcement.mts";
import {
  MULTI_TENANCY_DOC_ENTERPRISE_ACCEPTANCE_MARKERS,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_CRITERIA,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_DIMENSIONS,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_ENFORCEMENT_LIB,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_GATE,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SURFACE_RULE,
  TIP_007_012_ENTERPRISE_ACCEPTANCE_SECTION,
} from "./multi-tenancy-enterprise-acceptance-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-enterprise-acceptance-registry.mts"
);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyEnterpriseAcceptanceViolation =
  EnterpriseAcceptanceEnforcementViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyEnterpriseAcceptance(): MultiTenancyEnterpriseAcceptanceViolation[] {
  const violations: MultiTenancyEnterpriseAcceptanceViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "multi-tenancy-enterprise-acceptance-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (
    !registrySource.includes(MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SURFACE_RULE)
  ) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SURFACE_RULE}`,
    });
  }

  if (MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_CRITERIA.length !== 38) {
    violations.push({
      rule: "criterion-count",
      file: registryPath,
      message: "Enterprise acceptance registry must define exactly 38 criteria",
    });
  }

  if (MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_DIMENSIONS.length !== 5) {
    violations.push({
      rule: "dimension-count",
      file: registryPath,
      message:
        "Enterprise acceptance registry must define five category dimensions",
    });
  }

  const enforcementLibPath = join(
    repoRoot,
    MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_GATE);

  if (!existsSync(enforcementLibPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementLibPath,
      message: `${MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_GATE} is required`,
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
    for (const marker of MULTI_TENANCY_DOC_ENTERPRISE_ACCEPTANCE_MARKERS) {
      if (!multiTenancyContent.includes(marker)) {
        violations.push({
          rule: "doc-marker-missing",
          file: multiTenancyDocPath,
          message: `Missing enterprise acceptance marker: ${marker}`,
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
      !packageJsonContent.includes("check:multi-tenancy-enterprise-acceptance")
    ) {
      violations.push({
        rule: "check-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define check:multi-tenancy-enterprise-acceptance",
      });
    }

    if (
      !packageJsonContent.includes(
        "quality:multi-tenancy-enterprise-acceptance"
      )
    ) {
      violations.push({
        rule: "quality-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define quality:multi-tenancy-enterprise-acceptance",
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
    const contextIntegrationIndex = qualityChain.indexOf(
      "quality:multi-tenancy-context-integration"
    );
    const testsIndex = qualityChain.indexOf("quality:multi-tenancy-tests");
    const documentationVerificationIndex = qualityChain.indexOf(
      "quality:multi-tenancy-documentation-verification"
    );
    const enterpriseAcceptanceIndex = qualityChain.indexOf(
      "quality:multi-tenancy-enterprise-acceptance"
    );
    const testingVerificationAcceptanceIndex = qualityChain.indexOf(
      "quality:multi-tenancy-testing-verification-acceptance"
    );
    const dosIndex = qualityChain.indexOf(
      "quality:multi-tenancy-dos-prohibitions"
    );
    const finalOutputIndex = qualityChain.indexOf(
      "quality:multi-tenancy-final-output-format"
    );
    const deliveryIndex = qualityChain.indexOf(
      "quality:delivery-evidence-surface"
    );

    if (
      glossaryIndex === -1 ||
      auditIndex === -1 ||
      authorityIndex === -1 ||
      contextContractsIndex === -1 ||
      persistenceIndex === -1 ||
      tenantUrlIndex === -1 ||
      operatingResolverIndex === -1 ||
      contextIntegrationIndex === -1 ||
      testsIndex === -1 ||
      documentationVerificationIndex === -1 ||
      enterpriseAcceptanceIndex === -1 ||
      testingVerificationAcceptanceIndex === -1 ||
      dosIndex === -1 ||
      finalOutputIndex === -1 ||
      deliveryIndex === -1 ||
      glossaryIndex > auditIndex ||
      auditIndex > authorityIndex ||
      authorityIndex > contextContractsIndex ||
      contextContractsIndex > persistenceIndex ||
      persistenceIndex > tenantUrlIndex ||
      tenantUrlIndex > operatingResolverIndex ||
      operatingResolverIndex > contextIntegrationIndex ||
      contextIntegrationIndex > testsIndex ||
      testsIndex > documentationVerificationIndex ||
      documentationVerificationIndex > enterpriseAcceptanceIndex ||
      enterpriseAcceptanceIndex > testingVerificationAcceptanceIndex ||
      testingVerificationAcceptanceIndex > dosIndex ||
      dosIndex > finalOutputIndex ||
      finalOutputIndex > deliveryIndex
    ) {
      violations.push({
        rule: "quality-chain-order",
        file: packageJsonPath,
        message:
          "quality:… → testing-verification-acceptance → dos-prohibitions → final-output-format → delivery-evidence order required in pnpm quality",
      });
    }
  }

  violations.push(...collectEnterpriseAcceptanceViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyEnterpriseAcceptanceViolations(
  violations: readonly MultiTenancyEnterpriseAcceptanceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyEnterpriseAcceptance();
  if (violations.length > 0) {
    console.error(formatMultiTenancyEnterpriseAcceptanceViolations(violations));
    process.exit(1);
  }

  console.log("Multi-tenancy enterprise acceptance gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-enterprise-acceptance.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-enterprise-acceptance.mts");
  }
})();

if (isDirectRun) {
  main();
}
