#!/usr/bin/env tsx
/**
 * Multi-tenancy Do's and Prohibitions gate (multi-tenancy.md §447–480).
 *
 * Authoritative for glossary-first, consolidation-without-accounting scans,
 * forbidden `any`, accounting/TIP-013/business-module prohibition, architecture
 * check silence, and TODO-as-completion. Other Do's/Prohibitions delegate to
 * existing surface gates documented in multi-tenancy-dos-prohibitions-registry.mts.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { MULTI_TENANCY_DOC_REFERENCE } from "./delivery-evidence-surface-registry.mts";
import {
  collectArchitectureSilenceViolations,
  collectForbiddenAccountingViolations,
  collectForbiddenAnyViolations,
  collectForbiddenBusinessModulePathViolations,
  collectGlossaryViolations,
  collectGovernanceTestPresenceViolations,
  collectSessionTenantIdViolations,
  collectTodoAsCompletionViolations,
  type DosProhibitionsEnforcementViolation,
} from "./lib/multi-tenancy-dos-prohibitions-enforcement.mts";
import {
  MULTI_TENANCY_DOC_DOS_MARKERS,
  MULTI_TENANCY_DOC_PROHIBITIONS_MARKERS,
  MULTI_TENANCY_DOS_DELEGATED_GATES,
  MULTI_TENANCY_DOS_PROHIBITIONS_ENFORCEMENT_LIB,
  MULTI_TENANCY_DOS_PROHIBITIONS_GATE,
  MULTI_TENANCY_DOS_PROHIBITIONS_SURFACE_RULE,
  MULTI_TENANCY_PROHIBITION_ENFORCEMENT,
  TIP_007_012_DOS_PROHIBITIONS_SECTION,
} from "./multi-tenancy-dos-prohibitions-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-dos-prohibitions-registry.mts"
);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyDosProhibitionsViolation =
  DosProhibitionsEnforcementViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

function collectDocMarkerViolations(
  content: string | null,
  filePath: string,
  markers: readonly string[],
  sectionLabel: string
): MultiTenancyDosProhibitionsViolation[] {
  const violations: MultiTenancyDosProhibitionsViolation[] = [];

  if (content === null) {
    violations.push({
      rule: "doc-missing",
      file: filePath,
      message: `${filePath} is required for ${sectionLabel}`,
    });
    return violations;
  }

  for (const marker of markers) {
    if (!content.includes(marker)) {
      violations.push({
        rule: "doc-marker-missing",
        file: filePath,
        message: `Missing ${sectionLabel} marker: ${marker}`,
      });
    }
  }

  return violations;
}

function collectRegistryViolations(): MultiTenancyDosProhibitionsViolation[] {
  const violations: MultiTenancyDosProhibitionsViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "multi-tenancy-dos-prohibitions-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (!registrySource.includes(MULTI_TENANCY_DOS_PROHIBITIONS_SURFACE_RULE)) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_DOS_PROHIBITIONS_SURFACE_RULE}`,
    });
  }

  return violations;
}

function collectDeliveryDocViolations(
  deliveryContent: string | null
): MultiTenancyDosProhibitionsViolation[] {
  const violations: MultiTenancyDosProhibitionsViolation[] = [];

  if (deliveryContent === null) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `${TIP_007_012_DELIVERY_DOC} is required`,
    });
    return violations;
  }

  if (!deliveryContent.includes(MULTI_TENANCY_DOS_PROHIBITIONS_SURFACE_RULE)) {
    violations.push({
      rule: "delivery-surface-rule-missing",
      file: deliveryDocPath,
      message: `Delivery doc must document ${MULTI_TENANCY_DOS_PROHIBITIONS_SURFACE_RULE}`,
    });
  }

  if (!deliveryContent.includes(`## ${TIP_007_012_DOS_PROHIBITIONS_SECTION}`)) {
    violations.push({
      rule: "delivery-section-missing",
      file: deliveryDocPath,
      message: `Delivery doc missing section: ## ${TIP_007_012_DOS_PROHIBITIONS_SECTION}`,
    });
  }

  for (const entry of MULTI_TENANCY_DOS_DELEGATED_GATES) {
    if (!deliveryContent.includes(entry.marker)) {
      violations.push({
        rule: "delivery-do-mapping-missing",
        file: deliveryDocPath,
        message: `Delivery doc must map Do to gate: ${entry.marker}`,
      });
    }
  }

  for (const entry of MULTI_TENANCY_PROHIBITION_ENFORCEMENT) {
    if (!deliveryContent.includes(entry.marker)) {
      violations.push({
        rule: "delivery-prohibition-mapping-missing",
        file: deliveryDocPath,
        message: `Delivery doc must map Prohibition to enforcement: ${entry.marker}`,
      });
    }
  }

  violations.push(
    ...collectTodoAsCompletionViolations(deliveryContent, deliveryDocPath)
  );

  return violations;
}

function collectPackageJsonViolations(
  packageJsonContent: string | null
): MultiTenancyDosProhibitionsViolation[] {
  const violations: MultiTenancyDosProhibitionsViolation[] = [];

  if (packageJsonContent === null) {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "root package.json is required",
    });
    return violations;
  }

  const delegatedScripts = new Set<string>([
    "check:multi-tenancy-dos-prohibitions",
    "quality:multi-tenancy-dos-prohibitions",
    ...MULTI_TENANCY_DOS_DELEGATED_GATES.map((entry) => entry.checkScript),
    ...MULTI_TENANCY_PROHIBITION_ENFORCEMENT.map((entry) => entry.checkScript),
  ]);

  for (const script of delegatedScripts) {
    if (!packageJsonContent.includes(`"${script}"`)) {
      violations.push({
        rule: "delegated-gate-script-missing",
        file: packageJsonPath,
        message: `package.json must define script ${script} for §447–480 enforcement`,
      });
    }
  }

  if (!packageJsonContent.includes("quality:multi-tenancy-dos-prohibitions")) {
    violations.push({
      rule: "quality-chain-missing",
      file: packageJsonPath,
      message:
        "pnpm quality must include quality:multi-tenancy-dos-prohibitions before delivery-evidence",
    });
  }

  const qualityChainMatch = packageJsonContent.match(/"quality":\s*"([^"]+)"/);
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
        "quality:multi-tenancy-glossary-first → … → testing-verification-acceptance → dos-prohibitions → final-output-format → delivery-evidence order required",
    });
  }

  return violations;
}

function collectEnforcementLibViolations(): MultiTenancyDosProhibitionsViolation[] {
  const violations: MultiTenancyDosProhibitionsViolation[] = [];
  const enforcementLibPath = join(
    repoRoot,
    MULTI_TENANCY_DOS_PROHIBITIONS_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, MULTI_TENANCY_DOS_PROHIBITIONS_GATE);

  if (!existsSync(enforcementLibPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementLibPath,
      message: `${MULTI_TENANCY_DOS_PROHIBITIONS_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_DOS_PROHIBITIONS_GATE} is required`,
    });
  }

  return violations;
}

export function checkMultiTenancyDosProhibitions(): MultiTenancyDosProhibitionsViolation[] {
  const violations: MultiTenancyDosProhibitionsViolation[] = [];

  violations.push(...collectRegistryViolations());
  violations.push(...collectEnforcementLibViolations());

  const multiTenancyContent = readText(multiTenancyDocPath);
  violations.push(
    ...collectDocMarkerViolations(
      multiTenancyContent,
      multiTenancyDocPath,
      MULTI_TENANCY_DOC_DOS_MARKERS,
      "Do's"
    )
  );
  violations.push(
    ...collectDocMarkerViolations(
      multiTenancyContent,
      multiTenancyDocPath,
      MULTI_TENANCY_DOC_PROHIBITIONS_MARKERS,
      "Prohibitions"
    )
  );

  violations.push(...collectDeliveryDocViolations(deliveryContent));

  const packageJsonContent = readText(packageJsonPath);
  violations.push(...collectPackageJsonViolations(packageJsonContent));

  violations.push(...collectGlossaryViolations(repoRoot));
  violations.push(...collectForbiddenAnyViolations(repoRoot));
  violations.push(...collectSessionTenantIdViolations(repoRoot));
  violations.push(...collectForbiddenAccountingViolations(repoRoot));
  violations.push(...collectForbiddenBusinessModulePathViolations(repoRoot));
  violations.push(...collectArchitectureSilenceViolations(repoRoot));
  violations.push(...collectGovernanceTestPresenceViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyDosProhibitionsViolations(
  violations: readonly MultiTenancyDosProhibitionsViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyDosProhibitions();
  if (violations.length > 0) {
    console.error(formatMultiTenancyDosProhibitionsViolations(violations));
    process.exit(1);
  }

  console.log("Multi-tenancy Do's and Prohibitions gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-dos-prohibitions.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-dos-prohibitions.mts");
  }
})();

if (isDirectRun) {
  main();
}
