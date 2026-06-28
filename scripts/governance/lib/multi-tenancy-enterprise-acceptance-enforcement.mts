/**
 * Shared enterprise acceptance criteria enforcement (multi-tenancy.md §612–666).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { MULTI_TENANCY_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_CRITERIA,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_DIMENSIONS,
  MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SECTION,
} from "../multi-tenancy-enterprise-acceptance-registry.mts";

export interface EnterpriseAcceptanceEnforcementViolation {
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

export function collectEnterpriseAcceptanceViolations(
  repoRoot: string
): EnterpriseAcceptanceEnforcementViolation[] {
  const violations: EnterpriseAcceptanceEnforcementViolation[] = [];

  const deliveryPath = join(repoRoot, MULTI_TENANCY_DELIVERY_DOC);
  if (!existsSync(deliveryPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryPath,
      message: `Enterprise acceptance requires ${MULTI_TENANCY_DELIVERY_DOC}`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryPath, "utf8");
  const acceptanceSection = extractSection(
    deliveryContent,
    `## ${MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SECTION}`
  );

  if (acceptanceSection === null) {
    violations.push({
      rule: "acceptance-section-missing",
      file: deliveryPath,
      message: `Delivery doc missing section: ## ${MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_SECTION}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_DIMENSIONS) {
    if (!acceptanceSection.includes(dimension.tableMarker)) {
      violations.push({
        rule: "acceptance-dimension-missing",
        file: deliveryPath,
        message: `Delivery doc missing ${dimension.tableMarker}`,
      });
    }
  }

  const packageJsonPath = join(repoRoot, "package.json");
  const packageJsonContent = existsSync(packageJsonPath)
    ? readFileSync(packageJsonPath, "utf8")
    : "";

  for (const criterion of MULTI_TENANCY_ENTERPRISE_ACCEPTANCE_CRITERIA) {
    if (!acceptanceSection.includes(criterion.deliveryMarker)) {
      violations.push({
        rule: "acceptance-criterion-missing",
        file: deliveryPath,
        message: `Delivery doc matrix missing criterion "${criterion.id}": ${criterion.deliveryMarker}`,
      });
    }

    for (const gate of criterion.delegatedGates) {
      if (
        packageJsonContent.length > 0 &&
        !packageJsonContent.includes(`"${gate}"`)
      ) {
        violations.push({
          rule: "delegated-gate-missing",
          file: packageJsonPath,
          message: `Criterion "${criterion.id}" requires package.json script ${gate}`,
        });
      }
    }

    if (
      criterion.testFiles === undefined ||
      criterion.coverageMarkers === undefined
    ) {
      continue;
    }

    const sources: string[] = [];

    for (const relativePath of criterion.testFiles) {
      const absolutePath = join(repoRoot, relativePath);

      if (!existsSync(absolutePath)) {
        violations.push({
          rule: "acceptance-test-file-missing",
          file: absolutePath,
          message: `Criterion "${criterion.id}" missing test file: ${relativePath}`,
        });
        continue;
      }

      sources.push(readFileSync(absolutePath, "utf8"));
    }

    if (sources.length === 0) {
      continue;
    }

    const combinedSource = sources.join("\n");
    const hasCoverageMarker = criterion.coverageMarkers.some((marker) =>
      combinedSource.includes(marker)
    );

    if (!hasCoverageMarker) {
      violations.push({
        rule: "acceptance-test-marker-missing",
        file: join(repoRoot, criterion.testFiles[0] ?? ""),
        message: `Criterion "${criterion.id}" missing coverage marker in ${criterion.testFiles.join(", ")}`,
      });
    }
  }

  return violations;
}
