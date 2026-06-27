#!/usr/bin/env tsx
/**
 * Multi-tenancy tests gate (multi-tenancy.md Step 9, §580–599).
 *
 * Authoritative for Step 9 test matrix coverage — contract assertions, not snapshots.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { MULTI_TENANCY_DOC_REFERENCE } from "./delivery-evidence-surface-registry.mts";
import {
  collectMultiTenancyTestsViolations,
  type MultiTenancyTestsEnforcementViolation,
} from "./lib/multi-tenancy-tests-enforcement.mts";
import {
  MULTI_TENANCY_DOC_TESTS_MARKERS,
  MULTI_TENANCY_TEST_REQUIREMENTS,
  MULTI_TENANCY_TESTS_ENFORCEMENT_LIB,
  MULTI_TENANCY_TESTS_GATE,
  MULTI_TENANCY_TESTS_SURFACE_RULE,
} from "./multi-tenancy-tests-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-tests-registry.mts"
);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyTestsViolation = MultiTenancyTestsEnforcementViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyTests(): MultiTenancyTestsViolation[] {
  const violations: MultiTenancyTestsViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "multi-tenancy-tests-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (!registrySource.includes(MULTI_TENANCY_TESTS_SURFACE_RULE)) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_TESTS_SURFACE_RULE}`,
    });
  }

  if (MULTI_TENANCY_TEST_REQUIREMENTS.length !== 17) {
    violations.push({
      rule: "requirement-count",
      file: registryPath,
      message: "Step 9 registry must define exactly 17 test requirements",
    });
  }

  const enforcementLibPath = join(
    repoRoot,
    MULTI_TENANCY_TESTS_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, MULTI_TENANCY_TESTS_GATE);

  if (!existsSync(enforcementLibPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementLibPath,
      message: `${MULTI_TENANCY_TESTS_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_TESTS_GATE} is required`,
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
    for (const marker of MULTI_TENANCY_DOC_TESTS_MARKERS) {
      if (!multiTenancyContent.includes(marker)) {
        violations.push({
          rule: "doc-marker-missing",
          file: multiTenancyDocPath,
          message: `Missing Step 9 marker: ${marker}`,
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
    if (!packageJsonContent.includes("check:multi-tenancy-tests")) {
      violations.push({
        rule: "check-script-missing",
        file: packageJsonPath,
        message: "package.json must define check:multi-tenancy-tests",
      });
    }

    if (!packageJsonContent.includes("quality:multi-tenancy-tests")) {
      violations.push({
        rule: "quality-script-missing",
        file: packageJsonPath,
        message: "package.json must define quality:multi-tenancy-tests",
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
      glossaryIndex > auditIndex ||
      auditIndex > authorityIndex ||
      authorityIndex > contextContractsIndex ||
      contextContractsIndex > persistenceIndex ||
      persistenceIndex > tenantUrlIndex ||
      tenantUrlIndex > operatingResolverIndex ||
      operatingResolverIndex > contextIntegrationIndex ||
      contextIntegrationIndex > testsIndex
    ) {
      violations.push({
        rule: "quality-chain-order",
        file: packageJsonPath,
        message:
          "quality:… → operating-context-resolver → context-integration → multi-tenancy-tests order required in pnpm quality",
      });
    }
  }

  violations.push(...collectMultiTenancyTestsViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyTestsViolations(
  violations: readonly MultiTenancyTestsViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyTests();
  if (violations.length > 0) {
    console.error(formatMultiTenancyTestsViolations(violations));
    process.exit(1);
  }

  console.log("Multi-tenancy tests gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-tests.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-tests.mts");
  }
})();

if (isDirectRun) {
  main();
}
