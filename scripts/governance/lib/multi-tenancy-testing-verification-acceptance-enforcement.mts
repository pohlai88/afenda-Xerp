/**
 * Shared testing and verification acceptance enforcement (multi-tenancy.md §667–685).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { TIP_007_012_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_PRE_EXISTING_BLOCKER_MARKERS,
  MULTI_TENANCY_TESTING_ACCEPTANCE_REQUIREMENTS,
  MULTI_TENANCY_TESTING_VERIFICATION_DIMENSIONS,
  MULTI_TENANCY_VERIFICATION_ACCEPTANCE_REQUIREMENTS,
  TIP_007_012_TESTING_VERIFICATION_SECTION,
} from "../multi-tenancy-testing-verification-acceptance-registry.mts";

export interface TestingVerificationAcceptanceViolation {
  readonly rule: string;
  readonly file: string;
  readonly message: string;
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

export function collectTestingVerificationAcceptanceViolations(
  repoRoot: string
): TestingVerificationAcceptanceViolation[] {
  const violations: TestingVerificationAcceptanceViolation[] = [];

  const deliveryPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);
  if (!existsSync(deliveryPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryPath,
      message: `Testing/verification acceptance requires ${TIP_007_012_DELIVERY_DOC}`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryPath, "utf8");
  const verificationSection = extractSection(
    deliveryContent,
    `## ${TIP_007_012_TESTING_VERIFICATION_SECTION}`
  );

  if (verificationSection === null) {
    violations.push({
      rule: "verification-section-missing",
      file: deliveryPath,
      message: `Delivery doc missing section: ## ${TIP_007_012_TESTING_VERIFICATION_SECTION}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_TESTING_VERIFICATION_DIMENSIONS) {
    if (!verificationSection.includes(dimension.tableMarker)) {
      violations.push({
        rule: "acceptance-dimension-missing",
        file: deliveryPath,
        message: `Delivery doc missing ${dimension.tableMarker}`,
      });
    }
  }

  for (const requirement of MULTI_TENANCY_TESTING_ACCEPTANCE_REQUIREMENTS) {
    if (!verificationSection.includes(requirement.deliveryMarker)) {
      violations.push({
        rule: "testing-acceptance-missing",
        file: deliveryPath,
        message: `Delivery doc missing testing acceptance row: ${requirement.deliveryMarker}`,
      });
    }

    const sources: string[] = [];

    for (const relativePath of requirement.testFiles) {
      const absolutePath = join(repoRoot, relativePath);

      if (!existsSync(absolutePath)) {
        violations.push({
          rule: "testing-acceptance-file-missing",
          file: absolutePath,
          message: `Testing acceptance "${requirement.requirement}" missing test file: ${relativePath}`,
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
        rule: "testing-acceptance-marker-missing",
        file: join(repoRoot, requirement.testFiles[0] ?? ""),
        message: `Testing acceptance "${requirement.requirement}" missing coverage marker in ${requirement.testFiles.join(", ")}`,
      });
    }
  }

  for (const requirement of MULTI_TENANCY_VERIFICATION_ACCEPTANCE_REQUIREMENTS) {
    if (!verificationSection.includes(requirement.deliveryMarker)) {
      violations.push({
        rule: "verification-acceptance-missing",
        file: deliveryPath,
        message: `Delivery doc missing verification acceptance row: ${requirement.deliveryMarker}`,
      });
    }
  }

  const blockersSection = extractSection(
    verificationSection,
    "### Pre-existing blockers"
  );

  if (blockersSection === null) {
    violations.push({
      rule: "pre-existing-blockers-missing",
      file: deliveryPath,
      message: "Delivery doc missing ### Pre-existing blockers under Verification results",
    });
  } else {
    for (const marker of MULTI_TENANCY_PRE_EXISTING_BLOCKER_MARKERS) {
      if (!blockersSection.includes(marker)) {
        violations.push({
          rule: "pre-existing-blocker-marker-missing",
          file: deliveryPath,
          message: `Pre-existing blockers section must document: ${marker}`,
        });
      }
    }
  }

  const packageJsonPath = join(repoRoot, "package.json");
  if (!existsSync(packageJsonPath)) {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "root package.json is required for verification acceptance scripts",
    });
    return violations;
  }

  const packageJsonContent = readFileSync(packageJsonPath, "utf8");
  for (const requirement of MULTI_TENANCY_VERIFICATION_ACCEPTANCE_REQUIREMENTS) {
    const scriptPattern = new RegExp(
      `"${requirement.packageJsonScript}"\\s*:\\s*"[^"]+"`
    );
    if (!scriptPattern.test(packageJsonContent)) {
      violations.push({
        rule: "verification-script-missing",
        file: packageJsonPath,
        message: `package.json must define script "${requirement.packageJsonScript}" for ${requirement.command}`,
      });
    }
  }

  return violations;
}
