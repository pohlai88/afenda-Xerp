#!/usr/bin/env tsx
/**
 * Multi-tenancy documentation and verification gate (multi-tenancy.md Step 10, §601–611).
 *
 * Authoritative for delivery doc presence and canonical CI verification chain wiring.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  MULTI_TENANCY_DOC_REFERENCE,
  TIP_007_012_DELIVERY_DOC,
} from "./delivery-evidence-surface-registry.mts";
import {
  collectDocumentationVerificationViolations,
  type DocumentationVerificationEnforcementViolation,
} from "./lib/multi-tenancy-documentation-verification-enforcement.mts";
import {
  MULTI_TENANCY_DOC_DOCUMENTATION_VERIFICATION_MARKERS,
  MULTI_TENANCY_DOCUMENTATION_VERIFICATION_ENFORCEMENT_LIB,
  MULTI_TENANCY_DOCUMENTATION_VERIFICATION_GATE,
  MULTI_TENANCY_DOCUMENTATION_VERIFICATION_SURFACE_RULE,
  MULTI_TENANCY_VERIFICATION_COMMANDS,
  TIP_007_012_VERIFICATION_SECTION,
} from "./multi-tenancy-documentation-verification-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-documentation-verification-registry.mts"
);
const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyDocumentationVerificationViolation =
  DocumentationVerificationEnforcementViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyDocumentationVerification(): MultiTenancyDocumentationVerificationViolation[] {
  const violations: MultiTenancyDocumentationVerificationViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message:
        "multi-tenancy-documentation-verification-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (
    !registrySource.includes(MULTI_TENANCY_DOCUMENTATION_VERIFICATION_SURFACE_RULE)
  ) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_DOCUMENTATION_VERIFICATION_SURFACE_RULE}`,
    });
  }

  if (MULTI_TENANCY_VERIFICATION_COMMANDS.length !== 4) {
    violations.push({
      rule: "verification-command-count",
      file: registryPath,
      message: "Step 10 registry must define exactly four verification commands",
    });
  }

  const enforcementLibPath = join(
    repoRoot,
    MULTI_TENANCY_DOCUMENTATION_VERIFICATION_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, MULTI_TENANCY_DOCUMENTATION_VERIFICATION_GATE);

  if (!existsSync(enforcementLibPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementLibPath,
      message: `${MULTI_TENANCY_DOCUMENTATION_VERIFICATION_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_DOCUMENTATION_VERIFICATION_GATE} is required`,
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
    for (const marker of MULTI_TENANCY_DOC_DOCUMENTATION_VERIFICATION_MARKERS) {
      if (!multiTenancyContent.includes(marker)) {
        violations.push({
          rule: "doc-marker-missing",
          file: multiTenancyDocPath,
          message: `Missing Step 10 marker: ${marker}`,
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
    if (
      !deliveryContent.includes(
        MULTI_TENANCY_DOCUMENTATION_VERIFICATION_SURFACE_RULE
      )
    ) {
      violations.push({
        rule: "delivery-surface-rule-missing",
        file: deliveryDocPath,
        message: `Delivery doc must document ${MULTI_TENANCY_DOCUMENTATION_VERIFICATION_SURFACE_RULE}`,
      });
    }

    if (!deliveryContent.includes(`## ${TIP_007_012_VERIFICATION_SECTION}`)) {
      violations.push({
        rule: "delivery-section-missing",
        file: deliveryDocPath,
        message: `Delivery doc missing section: ## ${TIP_007_012_VERIFICATION_SECTION}`,
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
    if (
      !packageJsonContent.includes(
        "check:multi-tenancy-documentation-verification"
      )
    ) {
      violations.push({
        rule: "check-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define check:multi-tenancy-documentation-verification",
      });
    }

    if (
      !packageJsonContent.includes(
        "quality:multi-tenancy-documentation-verification"
      )
    ) {
      violations.push({
        rule: "quality-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define quality:multi-tenancy-documentation-verification",
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
    const dosIndex = qualityChain.indexOf("quality:multi-tenancy-dos-prohibitions");

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
      dosIndex === -1 ||
      glossaryIndex > auditIndex ||
      auditIndex > authorityIndex ||
      authorityIndex > contextContractsIndex ||
      contextContractsIndex > persistenceIndex ||
      persistenceIndex > tenantUrlIndex ||
      tenantUrlIndex > operatingResolverIndex ||
      operatingResolverIndex > contextIntegrationIndex ||
      contextIntegrationIndex > testsIndex ||
      testsIndex > documentationVerificationIndex ||
      documentationVerificationIndex > dosIndex
    ) {
      violations.push({
        rule: "quality-chain-order",
        file: packageJsonPath,
        message:
          "quality:… → operating-context-resolver → context-integration → multi-tenancy-tests → documentation-verification order required in pnpm quality",
      });
    }
  }

  violations.push(...collectDocumentationVerificationViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyDocumentationVerificationViolations(
  violations: readonly MultiTenancyDocumentationVerificationViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyDocumentationVerification();
  if (violations.length > 0) {
    console.error(
      formatMultiTenancyDocumentationVerificationViolations(violations)
    );
    process.exit(1);
  }

  console.log("Multi-tenancy documentation and verification gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-documentation-verification.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-documentation-verification.mts");
  }
})();

if (isDirectRun) {
  main();
}
