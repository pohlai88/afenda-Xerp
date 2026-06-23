#!/usr/bin/env tsx
/**
 * Delivery evidence surface gate (multi-tenancy.md §428–430).
 *
 * Verifies TIP-007 / TIP-012 delivery doc completeness, cross-reference from
 * multi-tenancy.md, governance gate documentation, and acceptance checklist.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DELIVERY_EVIDENCE_SURFACE_RULE,
  GOVERNANCE_DIST_BUILD_SCRIPT,
  MULTI_TENANCY_DOC_REFERENCE,
  MULTI_TENANCY_GOVERNANCE_GATES,
  TIP_007_012_ACCEPTANCE_CHECKLIST,
  TIP_007_012_DELIVERY_DOC,
  TIP_007_012_FORBIDDEN_OVERCLAIM_PATTERNS,
  TIP_007_012_MINIMUM_OVERALL_SCORE,
  TIP_007_012_REQUIRED_DISCLAIMERS,
  TIP_007_012_REQUIRED_SECTIONS,
  TIP_007_012_TIP008_TABLE_MARKERS,
} from "./delivery-evidence-surface-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");
const registryPath = join(
  repoRoot,
  "scripts/governance/delivery-evidence-surface-registry.mts"
);

export interface DeliveryEvidenceSurfaceViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

function hasSection(content: string, sectionTitle: string): boolean {
  const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^##\\s+${escaped}\\s*$`, "im");
  return pattern.test(content);
}

function parseOverallScore(content: string): number | null {
  const match = content.match(
    /\*\*Overall enterprise score\*\*\s*\|\s*\*\*(\d+(?:\.\d+)?)\s*\/\s*10\*\*/i
  );
  if (!match?.[1]) {
    return null;
  }

  return Number.parseFloat(match[1]);
}

function extractChecklistSection(content: string): string {
  const match = content.match(
    /^## Enterprise acceptance criteria checklist\s*\r?\n([\s\S]*?)(?=^## )/im
  );
  return match?.[0] ?? content;
}

function checklistItemChecked(content: string, item: string): boolean {
  const checklistSection = extractChecklistSection(content);
  const normalizedItem = item.toLowerCase();
  const matchPrefix = normalizedItem.slice(
    0,
    Math.min(48, normalizedItem.length)
  );

  let foundChecked = false;
  let foundUnchecked = false;

  for (const line of checklistSection.split(/\r?\n/)) {
    if (!line.includes("- [")) {
      continue;
    }

    const normalizedLine = line.toLowerCase();
    if (!normalizedLine.includes(matchPrefix)) {
      continue;
    }

    if (/^\s*-\s*\[x\]/i.test(line)) {
      foundChecked = true;
    }

    if (/^\s*-\s*\[\s\]/i.test(line)) {
      foundUnchecked = true;
    }
  }

  return foundChecked && !foundUnchecked;
}

export function checkDeliveryEvidenceSurface(): DeliveryEvidenceSurfaceViolation[] {
  const violations: DeliveryEvidenceSurfaceViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "delivery-evidence-surface-registry.mts is required",
    });
  }

  const deliveryContent = readText(deliveryDocPath);
  if (deliveryContent === null) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `${TIP_007_012_DELIVERY_DOC} is required`,
    });
    return violations;
  }

  if (!deliveryContent.includes(DELIVERY_EVIDENCE_SURFACE_RULE)) {
    violations.push({
      rule: "surface-rule-missing",
      file: deliveryDocPath,
      message: "Delivery doc must document DELIVERY_EVIDENCE_SURFACE_RULE",
    });
  }

  for (const section of TIP_007_012_REQUIRED_SECTIONS) {
    if (!hasSection(deliveryContent, section)) {
      violations.push({
        rule: "required-section-missing",
        file: deliveryDocPath,
        message: `Missing required section: ## ${section}`,
      });
    }
  }

  const multiTenancyContent = readText(multiTenancyDocPath);
  if (multiTenancyContent === null) {
    violations.push({
      rule: "multi-tenancy-doc-missing",
      file: multiTenancyDocPath,
      message: `${MULTI_TENANCY_DOC_REFERENCE} is required`,
    });
  } else if (!multiTenancyContent.includes(TIP_007_012_DELIVERY_DOC)) {
    violations.push({
      rule: "multi-tenancy-cross-reference",
      file: multiTenancyDocPath,
      message: `multi-tenancy.md must reference ${TIP_007_012_DELIVERY_DOC}`,
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
    for (const gate of MULTI_TENANCY_GOVERNANCE_GATES) {
      if (!packageJsonContent.includes(`"${gate.checkScript}"`)) {
        violations.push({
          rule: "check-script-missing",
          file: packageJsonPath,
          message: `package.json must define script ${gate.checkScript}`,
        });
      }

      if (!packageJsonContent.includes(`"${gate.qualityScript}"`)) {
        violations.push({
          rule: "quality-script-missing",
          file: packageJsonPath,
          message: `package.json must define script ${gate.qualityScript}`,
        });
      }

      const gatePath = join(repoRoot, gate.gateFile);
      if (!existsSync(gatePath)) {
        violations.push({
          rule: "gate-file-missing",
          file: gatePath,
          message: `Governance gate file missing for ${gate.checkScript}`,
        });
      }

      if (
        !(
          deliveryContent.includes(gate.checkScript) ||
          deliveryContent.includes(gate.qualityScript)
        )
      ) {
        violations.push({
          rule: "gate-not-documented",
          file: deliveryDocPath,
          message: `Delivery doc must reference ${gate.checkScript} or ${gate.qualityScript}`,
        });
      }
    }

    if (!packageJsonContent.includes("quality:delivery-evidence-surface")) {
      violations.push({
        rule: "quality-chain-missing",
        file: packageJsonPath,
        message: "pnpm quality must include quality:delivery-evidence-surface",
      });
    }

    if (!packageJsonContent.includes(`"${GOVERNANCE_DIST_BUILD_SCRIPT}"`)) {
      violations.push({
        rule: "governance-dist-script-missing",
        file: packageJsonPath,
        message: `package.json must define script ${GOVERNANCE_DIST_BUILD_SCRIPT}`,
      });
    }

    const qualityChain =
      packageJsonContent.match(/"quality":\s*"([^"]+)"/)?.[1] ?? "";
    if (!qualityChain.includes(GOVERNANCE_DIST_BUILD_SCRIPT)) {
      violations.push({
        rule: "governance-dist-not-in-quality",
        file: packageJsonPath,
        message: `pnpm quality must run ${GOVERNANCE_DIST_BUILD_SCRIPT} before surface gates`,
      });
    }
  }

  for (const item of TIP_007_012_ACCEPTANCE_CHECKLIST) {
    if (!checklistItemChecked(deliveryContent, item)) {
      violations.push({
        rule: "acceptance-checklist-unchecked",
        file: deliveryDocPath,
        message: `Acceptance checklist item must be checked [x]: ${item}`,
      });
    }
  }

  for (const disclaimer of TIP_007_012_REQUIRED_DISCLAIMERS) {
    if (!deliveryContent.toLowerCase().includes(disclaimer.toLowerCase())) {
      violations.push({
        rule: "scope-disclaimer-missing",
        file: deliveryDocPath,
        message: `Delivery doc must include scope disclaimer: "${disclaimer}"`,
      });
    }
  }

  for (const pattern of TIP_007_012_FORBIDDEN_OVERCLAIM_PATTERNS) {
    const proseLines = deliveryContent
      .split(/\r?\n/)
      .filter((line) => !/^\s*\|?\s*Do not\b/i.test(line));

    const matched = proseLines.some((line) => pattern.test(line));
    if (matched) {
      violations.push({
        rule: "tip-follow-on-overclaim",
        file: deliveryDocPath,
        message: `Delivery doc must not over-claim TIP-008/TIP-030 readiness (matched ${pattern})`,
      });
    }
  }

  for (const marker of TIP_007_012_TIP008_TABLE_MARKERS) {
    if (!deliveryContent.includes(marker)) {
      violations.push({
        rule: "tip008-table-vocabulary",
        file: deliveryDocPath,
        message: `Legal entity table must use authority-foundation status: ${marker}`,
      });
    }
  }

  if (
    !(
      deliveryContent.includes(GOVERNANCE_DIST_BUILD_SCRIPT) ||
      deliveryContent.includes("tsc -b --force")
    )
  ) {
    violations.push({
      rule: "dist-freshness-doc-missing",
      file: deliveryDocPath,
      message: `Verification section must document ${GOVERNANCE_DIST_BUILD_SCRIPT} or tsc -b --force`,
    });
  }

  const overallScore = parseOverallScore(deliveryContent);
  if (overallScore === null) {
    violations.push({
      rule: "overall-score-missing",
      file: deliveryDocPath,
      message:
        "Delivery doc must include **Overall enterprise score** row in Final score table",
    });
  } else if (overallScore < TIP_007_012_MINIMUM_OVERALL_SCORE) {
    violations.push({
      rule: "overall-score-below-minimum",
      file: deliveryDocPath,
      message: `Overall enterprise score must be >= ${TIP_007_012_MINIMUM_OVERALL_SCORE} (found ${overallScore})`,
    });
  }

  return violations;
}

export function formatDeliveryEvidenceViolations(
  violations: readonly DeliveryEvidenceSurfaceViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map(
      (violation) =>
        `[${violation.rule}] ${violation.file}\n  ${violation.message}`
    )
    .join("\n\n");
}

function main(): void {
  const violations = checkDeliveryEvidenceSurface();

  if (violations.length > 0) {
    console.error(formatDeliveryEvidenceViolations(violations));
    process.exitCode = 1;
    return;
  }

  console.log("Delivery evidence surface gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-delivery-evidence-surface.mts")
    );
  } catch {
    return entry.endsWith("check-delivery-evidence-surface.mts");
  }
})();

if (isDirectRun) {
  main();
}
