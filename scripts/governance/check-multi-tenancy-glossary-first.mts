#!/usr/bin/env tsx
/**
 * Multi-tenancy glossary-first gate (multi-tenancy.md Step 1, §484–500).
 *
 * Authoritative for canonical glossary vocabulary, 11 explicit term definitions,
 * and per-term do-not-confuse boundary notes before downstream slices.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  MULTI_TENANCY_DOC_REFERENCE,
  TIP_007_012_DELIVERY_DOC,
} from "./delivery-evidence-surface-registry.mts";
import {
  collectGlossaryFirstViolations,
  type GlossaryFirstEnforcementViolation,
} from "./lib/multi-tenancy-glossary-first-enforcement.mts";
import {
  MULTI_TENANCY_DOC_GLOSSARY_FIRST_MARKERS,
  MULTI_TENANCY_GLOSSARY_FIRST_ENFORCEMENT_LIB,
  MULTI_TENANCY_GLOSSARY_FIRST_GATE,
  MULTI_TENANCY_GLOSSARY_FIRST_REQUIRED_TERMS,
  MULTI_TENANCY_GLOSSARY_FIRST_SURFACE_RULE,
  MULTI_TENANCY_GLOSSARY_PATH,
  TIP_007_012_GLOSSARY_FIRST_SECTION,
} from "./multi-tenancy-glossary-first-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-glossary-first-registry.mts"
);
const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyGlossaryFirstViolation =
  GlossaryFirstEnforcementViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyGlossaryFirst(): MultiTenancyGlossaryFirstViolation[] {
  const violations: MultiTenancyGlossaryFirstViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "multi-tenancy-glossary-first-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (!registrySource.includes(MULTI_TENANCY_GLOSSARY_FIRST_SURFACE_RULE)) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_GLOSSARY_FIRST_SURFACE_RULE}`,
    });
  }

  const enforcementLibPath = join(
    repoRoot,
    MULTI_TENANCY_GLOSSARY_FIRST_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, MULTI_TENANCY_GLOSSARY_FIRST_GATE);

  if (!existsSync(enforcementLibPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementLibPath,
      message: `${MULTI_TENANCY_GLOSSARY_FIRST_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_GLOSSARY_FIRST_GATE} is required`,
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
    for (const marker of MULTI_TENANCY_DOC_GLOSSARY_FIRST_MARKERS) {
      if (!multiTenancyContent.includes(marker)) {
        violations.push({
          rule: "doc-marker-missing",
          file: multiTenancyDocPath,
          message: `Missing Step 1 marker: ${marker}`,
        });
      }
    }

    for (const term of MULTI_TENANCY_GLOSSARY_FIRST_REQUIRED_TERMS) {
      if (!multiTenancyContent.includes(term)) {
        violations.push({
          rule: "doc-term-missing",
          file: multiTenancyDocPath,
          message: `multi-tenancy.md Step 1 must list term: ${term}`,
        });
      }
    }

    if (!multiTenancyContent.includes(MULTI_TENANCY_GLOSSARY_PATH)) {
      violations.push({
        rule: "multi-tenancy-glossary-reference",
        file: multiTenancyDocPath,
        message: `multi-tenancy.md must reference ${MULTI_TENANCY_GLOSSARY_PATH}`,
      });
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
    if (!deliveryContent.includes(MULTI_TENANCY_GLOSSARY_FIRST_SURFACE_RULE)) {
      violations.push({
        rule: "delivery-surface-rule-missing",
        file: deliveryDocPath,
        message: `Delivery doc must document ${MULTI_TENANCY_GLOSSARY_FIRST_SURFACE_RULE}`,
      });
    }

    if (!deliveryContent.includes(`## ${TIP_007_012_GLOSSARY_FIRST_SECTION}`)) {
      violations.push({
        rule: "delivery-section-missing",
        file: deliveryDocPath,
        message: `Delivery doc missing section: ## ${TIP_007_012_GLOSSARY_FIRST_SECTION}`,
      });
    }

    for (const term of MULTI_TENANCY_GLOSSARY_FIRST_REQUIRED_TERMS) {
      if (!deliveryContent.includes(term)) {
        violations.push({
          rule: "delivery-term-missing",
          file: deliveryDocPath,
          message: `Delivery doc must document Step 1 term: ${term}`,
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
  } else if (
    !packageJsonContent.includes("check:multi-tenancy-glossary-first")
  ) {
    violations.push({
      rule: "check-script-missing",
      file: packageJsonPath,
      message: "package.json must define check:multi-tenancy-glossary-first",
    });
  } else if (
    !packageJsonContent.includes("quality:multi-tenancy-glossary-first")
  ) {
    violations.push({
      rule: "quality-script-missing",
      file: packageJsonPath,
      message: "package.json must define quality:multi-tenancy-glossary-first",
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

  if (glossaryIndex === -1 || auditIndex === -1 || glossaryIndex > auditIndex) {
    violations.push({
      rule: "quality-chain-order",
      file: packageJsonPath,
      message:
        "quality:multi-tenancy-glossary-first must run before quality:multi-tenancy-existing-state-audit in pnpm quality",
    });
  }

  violations.push(...collectGlossaryFirstViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyGlossaryFirstViolations(
  violations: readonly MultiTenancyGlossaryFirstViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyGlossaryFirst();
  if (violations.length > 0) {
    console.error(formatMultiTenancyGlossaryFirstViolations(violations));
    process.exit(1);
  }

  console.log("Multi-tenancy glossary-first gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-glossary-first.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-glossary-first.mts");
  }
})();

if (isDirectRun) {
  main();
}
