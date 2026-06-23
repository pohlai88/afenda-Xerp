#!/usr/bin/env tsx
/**
 * Multi-tenancy authority design gate (multi-tenancy.md Step 3, §503–509).
 *
 * Authoritative for package ownership, dependency edges, kernel contracts,
 * database persistence, and ERP application boundary confirmation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  MULTI_TENANCY_AUTHORITY_DESIGN_ENFORCEMENT_LIB,
  MULTI_TENANCY_AUTHORITY_DESIGN_GATE,
  MULTI_TENANCY_AUTHORITY_DESIGN_SURFACE_RULE,
  MULTI_TENANCY_DOC_AUTHORITY_DESIGN_MARKERS,
  TIP_007_012_AUTHORITY_DESIGN_SECTION,
} from "./multi-tenancy-authority-design-registry.mts";
import {
  MULTI_TENANCY_DOC_REFERENCE,
  TIP_007_012_DELIVERY_DOC,
} from "./delivery-evidence-surface-registry.mts";
import {
  collectAuthorityDesignViolations,
  type AuthorityDesignEnforcementViolation,
} from "./lib/multi-tenancy-authority-design-enforcement.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-authority-design-registry.mts"
);
const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyAuthorityDesignViolation =
  AuthorityDesignEnforcementViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyAuthorityDesign(): MultiTenancyAuthorityDesignViolation[] {
  const violations: MultiTenancyAuthorityDesignViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "multi-tenancy-authority-design-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (!registrySource.includes(MULTI_TENANCY_AUTHORITY_DESIGN_SURFACE_RULE)) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_AUTHORITY_DESIGN_SURFACE_RULE}`,
    });
  }

  const enforcementLibPath = join(
    repoRoot,
    MULTI_TENANCY_AUTHORITY_DESIGN_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, MULTI_TENANCY_AUTHORITY_DESIGN_GATE);

  if (!existsSync(enforcementLibPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementLibPath,
      message: `${MULTI_TENANCY_AUTHORITY_DESIGN_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_AUTHORITY_DESIGN_GATE} is required`,
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
    for (const marker of MULTI_TENANCY_DOC_AUTHORITY_DESIGN_MARKERS) {
      if (!multiTenancyContent.includes(marker)) {
        violations.push({
          rule: "doc-marker-missing",
          file: multiTenancyDocPath,
          message: `Missing Step 3 marker: ${marker}`,
        });
      }
    }
  }

  const deliveryContent = readText(deliveryDocPath);
  if (deliveryContent === null) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `${TIP_007_012_DELIVERY_DOC} is required`,
    });
  } else {
    if (!deliveryContent.includes(MULTI_TENANCY_AUTHORITY_DESIGN_SURFACE_RULE)) {
      violations.push({
        rule: "delivery-surface-rule-missing",
        file: deliveryDocPath,
        message: `Delivery doc must document ${MULTI_TENANCY_AUTHORITY_DESIGN_SURFACE_RULE}`,
      });
    }

    if (
      !deliveryContent.includes(`## ${TIP_007_012_AUTHORITY_DESIGN_SECTION}`)
    ) {
      violations.push({
        rule: "delivery-section-missing",
        file: deliveryDocPath,
        message: `Delivery doc missing section: ## ${TIP_007_012_AUTHORITY_DESIGN_SECTION}`,
      });
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
    if (!packageJsonContent.includes("check:multi-tenancy-authority-design")) {
      violations.push({
        rule: "check-script-missing",
        file: packageJsonPath,
        message: "package.json must define check:multi-tenancy-authority-design",
      });
    }

    if (
      !packageJsonContent.includes("quality:multi-tenancy-authority-design")
    ) {
      violations.push({
        rule: "quality-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define quality:multi-tenancy-authority-design",
      });
    }

    const qualityChainMatch = packageJsonContent.match(/"quality":\s*"([^"]+)"/);
    const qualityChain = qualityChainMatch?.[1] ?? "";
    const glossaryIndex = qualityChain.indexOf("quality:multi-tenancy-glossary-first");
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
    const dosIndex = qualityChain.indexOf("quality:multi-tenancy-dos-prohibitions");

    if (
      glossaryIndex === -1 ||
      auditIndex === -1 ||
      authorityIndex === -1 ||
      contextContractsIndex === -1 ||
      persistenceIndex === -1 ||
      tenantUrlIndex === -1 ||
      dosIndex === -1 ||
      glossaryIndex > auditIndex ||
      auditIndex > authorityIndex ||
      authorityIndex > contextContractsIndex ||
      contextContractsIndex > persistenceIndex ||
      persistenceIndex > tenantUrlIndex ||
      tenantUrlIndex > dosIndex
    ) {
      violations.push({
        rule: "quality-chain-order",
        file: packageJsonPath,
        message:
          "quality:multi-tenancy-glossary-first → existing-state-audit → authority-design → context-contracts → persistence-lookup → tenant-url-resolver → operating-context-resolver → dos-prohibitions order required in pnpm quality",
      });
    }
  }

  violations.push(...collectAuthorityDesignViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyAuthorityDesignViolations(
  violations: readonly MultiTenancyAuthorityDesignViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyAuthorityDesign();
  if (violations.length > 0) {
    console.error(formatMultiTenancyAuthorityDesignViolations(violations));
    process.exit(1);
  }

  console.log("Multi-tenancy authority design gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-authority-design.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-authority-design.mts");
  }
})();

if (isDirectRun) {
  main();
}
