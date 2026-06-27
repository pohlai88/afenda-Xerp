#!/usr/bin/env tsx
/**
 * Multi-tenancy testing and verification acceptance gate (multi-tenancy.md §667–685).
 *
 * Authoritative for slice sign-off — maps testing acceptance bullets to contract
 * tests and verification acceptance to canonical CI commands with documented
 * pre-existing blockers.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  MULTI_TENANCY_DOC_REFERENCE,
} from "./delivery-evidence-surface-registry.mts";
import {
  collectTestingVerificationAcceptanceViolations,
  type TestingVerificationAcceptanceViolation,
} from "./lib/multi-tenancy-testing-verification-acceptance-enforcement.mts";
import {
  MULTI_TENANCY_DOC_TESTING_VERIFICATION_MARKERS,
  MULTI_TENANCY_TESTING_ACCEPTANCE_REQUIREMENTS,
  MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_ENFORCEMENT_LIB,
  MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_GATE,
  MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_SURFACE_RULE,
  MULTI_TENANCY_TESTING_VERIFICATION_DIMENSIONS,
  MULTI_TENANCY_VERIFICATION_ACCEPTANCE_REQUIREMENTS,
  TIP_007_012_TESTING_VERIFICATION_SECTION,
} from "./multi-tenancy-testing-verification-acceptance-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-testing-verification-acceptance-registry.mts"
);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyTestingVerificationAcceptanceViolation =
  TestingVerificationAcceptanceViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyTestingVerificationAcceptance(): MultiTenancyTestingVerificationAcceptanceViolation[] {
  const violations: MultiTenancyTestingVerificationAcceptanceViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message:
        "multi-tenancy-testing-verification-acceptance-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (
    !registrySource.includes(
      MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_SURFACE_RULE
    )
  ) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_SURFACE_RULE}`,
    });
  }

  if (MULTI_TENANCY_TESTING_ACCEPTANCE_REQUIREMENTS.length !== 8) {
    violations.push({
      rule: "testing-requirement-count",
      file: registryPath,
      message:
        "Testing acceptance registry must define exactly 8 requirements (§669–676)",
    });
  }

  if (MULTI_TENANCY_VERIFICATION_ACCEPTANCE_REQUIREMENTS.length !== 4) {
    violations.push({
      rule: "verification-requirement-count",
      file: registryPath,
      message:
        "Verification acceptance registry must define exactly 4 CI commands (§680–683)",
    });
  }

  const enforcementPath = join(
    repoRoot,
    MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_ENFORCEMENT_LIB
  );
  if (!existsSync(enforcementPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementPath,
      message: `${MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_ENFORCEMENT_LIB} is required`,
    });
  }

  const gatePath = join(
    repoRoot,
    MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_GATE
  );
  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-script-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_GATE} is required`,
    });
  }

  const multiTenancyDoc = readText(multiTenancyDocPath);
  if (multiTenancyDoc === null) {
    violations.push({
      rule: "multi-tenancy-doc-missing",
      file: multiTenancyDocPath,
      message: `${MULTI_TENANCY_DOC_REFERENCE} is required`,
    });
  } else {
    for (const marker of MULTI_TENANCY_DOC_TESTING_VERIFICATION_MARKERS) {
      if (!multiTenancyDoc.includes(marker)) {
        violations.push({
          rule: "multi-tenancy-doc-marker-missing",
          file: multiTenancyDocPath,
          message: `multi-tenancy.md must include: ${marker}`,
        });
      }
    }
  }

  const deliveryDoc = readText(deliveryDocPath);
  if (deliveryDoc === null) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `Delivery evidence doc required: ${TIP_007_012_DELIVERY_DOC}`,
    });
  } else {
    if (
      !deliveryDoc.includes(
        MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_SURFACE_RULE
      )
    ) {
      violations.push({
        rule: "delivery-surface-rule-missing",
        file: deliveryDocPath,
        message: `Delivery doc must document surface rule: ${MULTI_TENANCY_TESTING_VERIFICATION_ACCEPTANCE_SURFACE_RULE}`,
      });
    }

    if (
      !deliveryDoc.includes(`## ${TIP_007_012_TESTING_VERIFICATION_SECTION}`)
    ) {
      violations.push({
        rule: "delivery-verification-section-missing",
        file: deliveryDocPath,
        message: `Delivery doc must include ## ${TIP_007_012_TESTING_VERIFICATION_SECTION}`,
      });
    }

    for (const dimension of MULTI_TENANCY_TESTING_VERIFICATION_DIMENSIONS) {
      if (!deliveryDoc.includes(dimension.tableMarker)) {
        violations.push({
          rule: "delivery-dimension-missing",
          file: deliveryDocPath,
          message: `Delivery doc missing ${dimension.tableMarker}`,
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
      !packageJsonContent.includes(
        "check:multi-tenancy-testing-verification-acceptance"
      )
    ) {
      violations.push({
        rule: "check-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define check:multi-tenancy-testing-verification-acceptance",
      });
    }

    if (
      !packageJsonContent.includes(
        "quality:multi-tenancy-testing-verification-acceptance"
      )
    ) {
      violations.push({
        rule: "quality-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define quality:multi-tenancy-testing-verification-acceptance",
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

  violations.push(...collectTestingVerificationAcceptanceViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyTestingVerificationAcceptanceViolations(
  violations: readonly MultiTenancyTestingVerificationAcceptanceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyTestingVerificationAcceptance();
  if (violations.length > 0) {
    console.error(
      formatMultiTenancyTestingVerificationAcceptanceViolations(violations)
    );
    process.exit(1);
  }

  console.log("Multi-tenancy testing and verification acceptance gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-testing-verification-acceptance.mts")
    );
  } catch {
    return entry.endsWith(
      "check-multi-tenancy-testing-verification-acceptance.mts"
    );
  }
})();

if (isDirectRun) {
  main();
}
