/**
 * Shared expected final output format enforcement (multi-tenancy.md §686–718).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { TIP_007_012_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_FINAL_OUTPUT_MINIMUM_DIMENSION_SCORE,
  MULTI_TENANCY_FINAL_OUTPUT_SECTIONS,
  MULTI_TENANCY_FINAL_SCORE_DIMENSIONS,
} from "../multi-tenancy-final-output-format-registry.mts";

export interface FinalOutputFormatViolation {
  readonly rule: string;
  readonly file: string;
  readonly message: string;
}

function hasSection(content: string, sectionTitle: string): boolean {
  const escaped = sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^##\\s+${escaped}\\s*$`, "im");
  return pattern.test(content);
}

function extractFinalScoreSection(content: string): string | null {
  const match = content.match(/^## Final score\s*[\r\n]+([\s\S]*)$/im);
  return match?.[0] ?? null;
}

function parseDimensionScore(
  sectionContent: string,
  dimension: string
): number | null {
  const escaped = dimension.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `\\|\\s*(?:\\*\\*)?${escaped}(?:\\*\\*)?\\s*\\|\\s*(?:\\*\\*)?(\\d+(?:\\.\\d+)?)\\s*/\\s*10`,
    "i"
  );
  const match = sectionContent.match(pattern);
  if (!match?.[1]) {
    return null;
  }

  return Number.parseFloat(match[1]);
}

export function collectFinalOutputFormatViolations(
  repoRoot: string
): FinalOutputFormatViolation[] {
  const violations: FinalOutputFormatViolation[] = [];

  const deliveryPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);
  if (!existsSync(deliveryPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryPath,
      message: `Final output format requires ${TIP_007_012_DELIVERY_DOC}`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryPath, "utf8");

  for (const section of MULTI_TENANCY_FINAL_OUTPUT_SECTIONS) {
    if (!hasSection(deliveryContent, section)) {
      violations.push({
        rule: "final-output-section-missing",
        file: deliveryPath,
        message: `Delivery doc missing required section: ## ${section}`,
      });
    }
  }

  const finalScoreSection = extractFinalScoreSection(deliveryContent);
  if (finalScoreSection === null) {
    violations.push({
      rule: "final-score-section-missing",
      file: deliveryPath,
      message: "Delivery doc must include ## Final score with dimension table",
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_FINAL_SCORE_DIMENSIONS) {
    const score = parseDimensionScore(finalScoreSection, dimension);
    if (score === null) {
      violations.push({
        rule: "final-score-dimension-missing",
        file: deliveryPath,
        message: `Final score table must include row: ${dimension}`,
      });
      continue;
    }

    if (score < MULTI_TENANCY_FINAL_OUTPUT_MINIMUM_DIMENSION_SCORE) {
      violations.push({
        rule: "final-score-dimension-below-minimum",
        file: deliveryPath,
        message: `${dimension} must be >= ${MULTI_TENANCY_FINAL_OUTPUT_MINIMUM_DIMENSION_SCORE} / 10 (found ${score})`,
      });
    }
  }

  return violations;
}
