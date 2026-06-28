/**
 * Shared Step 9 multi-tenancy test coverage enforcement (multi-tenancy.md §580–599).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { MULTI_TENANCY_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_TEST_REQUIREMENT_MARKERS,
  MULTI_TENANCY_TEST_REQUIREMENTS,
  MULTI_TENANCY_TESTS_DIMENSIONS,
  MULTI_TENANCY_TESTS_SECTION,
} from "../multi-tenancy-tests-registry.mts";

export interface MultiTenancyTestsEnforcementViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function extractSection(content: string, heading: string): string | null {
  const headingIndex = content.indexOf(heading);
  if (headingIndex === -1) {
    return null;
  }

  const afterHeading = content.slice(headingIndex + heading.length);
  const nextSectionMatch = afterHeading.match(/\n## /);
  const sectionEnd =
    nextSectionMatch?.index === undefined
      ? content.length
      : headingIndex + heading.length + nextSectionMatch.index;

  return content.slice(headingIndex, sectionEnd);
}

function collectRequirementViolations(
  repoRoot: string
): MultiTenancyTestsEnforcementViolation[] {
  const violations: MultiTenancyTestsEnforcementViolation[] = [];

  for (const requirement of MULTI_TENANCY_TEST_REQUIREMENTS) {
    const sources: string[] = [];

    for (const relativePath of requirement.testFiles) {
      const absolutePath = join(repoRoot, relativePath);

      if (!existsSync(absolutePath)) {
        violations.push({
          rule: "test-file-missing",
          file: absolutePath,
          message: `Step 9 requirement "${requirement.requirement}" missing test file: ${relativePath}`,
        });
        continue;
      }

      sources.push(readFileSync(absolutePath, "utf8"));
    }

    if (sources.length === 0) {
      continue;
    }

    const combinedSource = sources.join("\n");
    const hasCoverageMarker = requirement.coverageMarkers.some((marker) =>
      combinedSource.includes(marker)
    );

    if (!hasCoverageMarker) {
      violations.push({
        rule: "test-coverage-marker-missing",
        file: join(repoRoot, requirement.testFiles[0] ?? ""),
        message: `Step 9 requirement "${requirement.requirement}" missing coverage marker in ${requirement.testFiles.join(", ")}`,
      });
    }
  }

  return violations;
}

function collectDeliverySectionViolations(
  repoRoot: string
): MultiTenancyTestsEnforcementViolation[] {
  const violations: MultiTenancyTestsEnforcementViolation[] = [];
  const deliveryPath = join(repoRoot, MULTI_TENANCY_DELIVERY_DOC);

  if (!existsSync(deliveryPath)) {
    return violations;
  }

  const deliveryContent = readFileSync(deliveryPath, "utf8");
  const section = extractSection(
    deliveryContent,
    `## ${MULTI_TENANCY_TESTS_SECTION}`
  );

  if (section === null) {
    violations.push({
      rule: "delivery-section-missing",
      file: deliveryPath,
      message: `Delivery doc missing section: ## ${MULTI_TENANCY_TESTS_SECTION}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_TESTS_DIMENSIONS) {
    if (!section.includes(dimension.tableMarker)) {
      violations.push({
        rule: "delivery-dimension-missing",
        file: deliveryPath,
        message: `Delivery doc missing ${dimension.tableMarker}`,
      });
    }
  }

  for (const marker of MULTI_TENANCY_TEST_REQUIREMENT_MARKERS) {
    if (!section.includes(marker)) {
      violations.push({
        rule: "delivery-requirement-marker-missing",
        file: deliveryPath,
        message: `Delivery doc Step 9 matrix missing requirement: ${marker}`,
      });
    }
  }

  return violations;
}

export function collectMultiTenancyTestsViolations(
  repoRoot: string
): MultiTenancyTestsEnforcementViolation[] {
  return [
    ...collectRequirementViolations(repoRoot),
    ...collectDeliverySectionViolations(repoRoot),
  ];
}
