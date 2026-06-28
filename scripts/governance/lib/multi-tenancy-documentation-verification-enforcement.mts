/**
 * Shared Step 10 documentation and verification enforcement (multi-tenancy.md §601–611).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { MULTI_TENANCY_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_DOCUMENTATION_VERIFICATION_DIMENSIONS,
  MULTI_TENANCY_VERIFICATION_COMMAND_MARKERS,
  MULTI_TENANCY_VERIFICATION_COMMANDS,
  MULTI_TENANCY_VERIFICATION_SECTION,
} from "../multi-tenancy-documentation-verification-registry.mts";

export interface DocumentationVerificationEnforcementViolation {
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

export function collectDocumentationVerificationViolations(
  repoRoot: string
): DocumentationVerificationEnforcementViolation[] {
  const violations: DocumentationVerificationEnforcementViolation[] = [];

  const deliveryPath = join(repoRoot, MULTI_TENANCY_DELIVERY_DOC);
  if (!existsSync(deliveryPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryPath,
      message: `Step 10 requires delivery doc at ${MULTI_TENANCY_DELIVERY_DOC}`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryPath, "utf8");
  const verificationSection = extractSection(
    deliveryContent,
    `## ${MULTI_TENANCY_VERIFICATION_SECTION}`
  );

  if (verificationSection === null) {
    violations.push({
      rule: "verification-section-missing",
      file: deliveryPath,
      message: `Delivery doc missing section: ## ${MULTI_TENANCY_VERIFICATION_SECTION}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_DOCUMENTATION_VERIFICATION_DIMENSIONS) {
    if (!verificationSection.includes(dimension.tableMarker)) {
      violations.push({
        rule: "delivery-dimension-missing",
        file: deliveryPath,
        message: `Delivery doc missing ${dimension.tableMarker}`,
      });
    }
  }

  for (const marker of MULTI_TENANCY_VERIFICATION_COMMAND_MARKERS) {
    if (!verificationSection.includes(marker)) {
      violations.push({
        rule: "verification-command-missing",
        file: deliveryPath,
        message: `Verification results must document Step 10 command: ${marker}`,
      });
    }
  }

  const packageJsonPath = join(repoRoot, "package.json");
  if (!existsSync(packageJsonPath)) {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "root package.json is required for Step 10 verification scripts",
    });
    return violations;
  }

  const packageJsonContent = readFileSync(packageJsonPath, "utf8");
  for (const entry of MULTI_TENANCY_VERIFICATION_COMMANDS) {
    const scriptPattern = new RegExp(
      `"${entry.packageJsonScript}"\\s*:\\s*"[^"]+"`
    );
    if (!scriptPattern.test(packageJsonContent)) {
      violations.push({
        rule: "verification-script-missing",
        file: packageJsonPath,
        message: `package.json must define script "${entry.packageJsonScript}" for ${entry.command}`,
      });
    }
  }

  return violations;
}
