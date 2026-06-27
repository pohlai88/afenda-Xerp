#!/usr/bin/env tsx
/**
 * Multi-tenancy expected final output format gate (multi-tenancy.md §686–718).
 *
 * Authoritative for delivery doc shape — 20 required H2 sections and nine
 * scored dimensions at or above the enterprise minimum.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { MULTI_TENANCY_DOC_REFERENCE } from "./delivery-evidence-surface-registry.mts";
import {
  collectFinalOutputFormatViolations,
  type FinalOutputFormatViolation,
} from "./lib/multi-tenancy-final-output-format-enforcement.mts";
import {
  MULTI_TENANCY_DOC_FINAL_OUTPUT_MARKERS,
  MULTI_TENANCY_FINAL_OUTPUT_FORMAT_ENFORCEMENT_LIB,
  MULTI_TENANCY_FINAL_OUTPUT_FORMAT_GATE,
  MULTI_TENANCY_FINAL_OUTPUT_FORMAT_SURFACE_RULE,
  MULTI_TENANCY_FINAL_OUTPUT_SECTIONS,
  MULTI_TENANCY_FINAL_SCORE_DIMENSIONS,
} from "./multi-tenancy-final-output-format-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-final-output-format-registry.mts"
);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyFinalOutputFormatViolation = FinalOutputFormatViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyFinalOutputFormat(): MultiTenancyFinalOutputFormatViolation[] {
  const violations: MultiTenancyFinalOutputFormatViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "multi-tenancy-final-output-format-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (
    !registrySource.includes(MULTI_TENANCY_FINAL_OUTPUT_FORMAT_SURFACE_RULE)
  ) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_FINAL_OUTPUT_FORMAT_SURFACE_RULE}`,
    });
  }

  if (MULTI_TENANCY_FINAL_OUTPUT_SECTIONS.length !== 20) {
    violations.push({
      rule: "section-count",
      file: registryPath,
      message: "Final output registry must define exactly 20 delivery sections",
    });
  }

  if (MULTI_TENANCY_FINAL_SCORE_DIMENSIONS.length !== 9) {
    violations.push({
      rule: "score-dimension-count",
      file: registryPath,
      message: "Final output registry must define exactly 9 score dimensions",
    });
  }

  const enforcementPath = join(
    repoRoot,
    MULTI_TENANCY_FINAL_OUTPUT_FORMAT_ENFORCEMENT_LIB
  );
  if (!existsSync(enforcementPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementPath,
      message: `${MULTI_TENANCY_FINAL_OUTPUT_FORMAT_ENFORCEMENT_LIB} is required`,
    });
  }

  const gatePath = join(repoRoot, MULTI_TENANCY_FINAL_OUTPUT_FORMAT_GATE);
  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-script-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_FINAL_OUTPUT_FORMAT_GATE} is required`,
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
    for (const marker of MULTI_TENANCY_DOC_FINAL_OUTPUT_MARKERS) {
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
  } else if (
    !deliveryDoc.includes(MULTI_TENANCY_FINAL_OUTPUT_FORMAT_SURFACE_RULE)
  ) {
    violations.push({
      rule: "delivery-surface-rule-missing",
      file: deliveryDocPath,
      message: `Delivery doc must document surface rule: ${MULTI_TENANCY_FINAL_OUTPUT_FORMAT_SURFACE_RULE}`,
    });
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
      !packageJsonContent.includes("check:multi-tenancy-final-output-format")
    ) {
      violations.push({
        rule: "check-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define check:multi-tenancy-final-output-format",
      });
    }

    if (
      !packageJsonContent.includes("quality:multi-tenancy-final-output-format")
    ) {
      violations.push({
        rule: "quality-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define quality:multi-tenancy-final-output-format",
      });
    }

    const qualityChainMatch = packageJsonContent.match(
      /"quality":\s*"([^"]+)"/
    );
    const qualityChain = qualityChainMatch?.[1] ?? "";
    const dosIndex = qualityChain.indexOf(
      "quality:multi-tenancy-dos-prohibitions"
    );
    const finalOutputIndex = qualityChain.indexOf(
      "quality:multi-tenancy-final-output-format"
    );
    const deliveryIndex = qualityChain.indexOf(
      "quality:delivery-evidence-surface"
    );

    if (dosIndex === -1 || finalOutputIndex === -1 || deliveryIndex === -1) {
      violations.push({
        rule: "quality-chain-missing",
        file: packageJsonPath,
        message:
          "pnpm quality must include dos-prohibitions, final-output-format, and delivery-evidence-surface",
      });
    } else if (
      !(dosIndex < finalOutputIndex && finalOutputIndex < deliveryIndex)
    ) {
      violations.push({
        rule: "quality-chain-order",
        file: packageJsonPath,
        message:
          "quality:… → dos-prohibitions → final-output-format → delivery-evidence order required in pnpm quality",
      });
    }
  }

  violations.push(...collectFinalOutputFormatViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyFinalOutputFormatViolations(
  violations: readonly MultiTenancyFinalOutputFormatViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyFinalOutputFormat();
  if (violations.length > 0) {
    console.error(formatMultiTenancyFinalOutputFormatViolations(violations));
    process.exit(1);
  }

  console.log("Multi-tenancy final output format gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-final-output-format.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-final-output-format.mts");
  }
})();

if (isDirectRun) {
  main();
}
