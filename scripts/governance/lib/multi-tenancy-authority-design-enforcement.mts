/**
 * Shared Step 3 authority design enforcement (multi-tenancy.md §503–509).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  MULTI_TENANCY_AUTHORITY_OWNERS,
  MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES,
  MULTI_TENANCY_REQUIRED_APPROVED_RUNTIME_EDGES,
} from "../../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts";
import { DATABASE_TENANT_DOMAIN_MODULES } from "../../../packages/database/src/tenant-domain/tenant-domain-registry.ts";
import { KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES } from "../../../packages/kernel/src/context/context-registry.ts";
import { TIP_007_012_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_AUTHORITY_DESIGN_DIMENSIONS,
  MULTI_TENANCY_DATABASE_PERSISTENCE_ROW_MARKERS,
  MULTI_TENANCY_DEPENDENCY_EDGE_ROW_MARKERS,
  MULTI_TENANCY_ERP_OWNERSHIP_ROW_MARKERS,
  MULTI_TENANCY_KERNEL_CONTRACT_ROW_MARKERS,
  MULTI_TENANCY_PACKAGE_OWNERSHIP_ROW_MARKERS,
  TIP_007_012_AUTHORITY_DESIGN_SECTION,
} from "../multi-tenancy-authority-design-registry.mts";

export interface AuthorityDesignEnforcementViolation {
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

function collectMissingMarkers(
  content: string,
  markers: readonly string[],
  rule: string,
  file: string,
  label: string
): AuthorityDesignEnforcementViolation[] {
  const violations: AuthorityDesignEnforcementViolation[] = [];

  for (const marker of markers) {
    if (!content.includes(marker)) {
      violations.push({
        rule,
        file,
        message: `${label} table missing row marker: ${marker}`,
      });
    }
  }

  return violations;
}

function collectArtifactViolations(
  repoRoot: string
): AuthorityDesignEnforcementViolation[] {
  const violations: AuthorityDesignEnforcementViolation[] = [];

  for (const dimension of MULTI_TENANCY_AUTHORITY_DESIGN_DIMENSIONS) {
    if (!("artifactPaths" in dimension)) {
      continue;
    }

    for (const relativePath of dimension.artifactPaths) {
      const absolutePath = join(repoRoot, relativePath);
      if (!existsSync(absolutePath)) {
        violations.push({
          rule: "authority-artifact-missing",
          file: absolutePath,
          message: `${dimension.id} authority design requires artifact: ${relativePath}`,
        });
      }
    }
  }

  return violations;
}

function collectRegistryArtifactViolations(
  repoRoot: string
): AuthorityDesignEnforcementViolation[] {
  const violations: AuthorityDesignEnforcementViolation[] = [];

  for (const dimension of MULTI_TENANCY_AUTHORITY_DESIGN_DIMENSIONS) {
    if (!("registryImport" in dimension)) {
      continue;
    }

    const absolutePath = join(repoRoot, dimension.registryImport);
    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "authority-registry-missing",
        file: absolutePath,
        message: `${dimension.id} authority registry missing: ${dimension.registryImport}`,
      });
    }
  }

  return violations;
}

function collectRegistryBaselineViolations(
  repoRoot: string
): AuthorityDesignEnforcementViolation[] {
  const violations: AuthorityDesignEnforcementViolation[] = [];

  for (const module of DATABASE_TENANT_DOMAIN_MODULES) {
    const barrelPath = join(
      repoRoot,
      "packages/database/src",
      module.directory,
      "index.ts"
    );

    if (!existsSync(barrelPath)) {
      violations.push({
        rule: "database-module-missing",
        file: barrelPath,
        message: `Database tenant-domain barrel missing for ${module.glossaryTerm}`,
      });
    }
  }

  for (const module of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
    const contractPath = join(
      repoRoot,
      "packages/kernel/src/context",
      module.file
    );

    if (!existsSync(contractPath)) {
      violations.push({
        rule: "kernel-contract-missing",
        file: contractPath,
        message: `Kernel serializable contract missing: ${module.primaryType}`,
      });
    }
  }

  return violations;
}

function collectRegistryOwnershipViolations(
  deliveryContent: string,
  deliveryDocPath: string
): AuthorityDesignEnforcementViolation[] {
  const violations: AuthorityDesignEnforcementViolation[] = [];

  for (const entry of MULTI_TENANCY_AUTHORITY_OWNERS) {
    if (!deliveryContent.includes(entry.owner)) {
      violations.push({
        rule: "package-owner-undocumented",
        file: deliveryDocPath,
        message: `Authority design must document package owner: ${entry.owner}`,
      });
    }

    if (!deliveryContent.includes(entry.responsibility)) {
      violations.push({
        rule: "package-responsibility-undocumented",
        file: deliveryDocPath,
        message: `Authority design must document responsibility for ${entry.owner}: ${entry.responsibility}`,
      });
    }
  }

  for (const edge of MULTI_TENANCY_REQUIRED_APPROVED_RUNTIME_EDGES) {
    const edgeLabel = `${edge.from} → ${edge.to}`;
    if (
      !(
        deliveryContent.includes(edge.from) && deliveryContent.includes(edge.to)
      )
    ) {
      violations.push({
        rule: "approved-edge-undocumented",
        file: deliveryDocPath,
        message: `Authority design must document approved edge: ${edgeLabel}`,
      });
    }
  }

  for (const edge of MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES) {
    if (
      !(
        deliveryContent.includes(edge.from) && deliveryContent.includes(edge.to)
      )
    ) {
      violations.push({
        rule: "forbidden-edge-undocumented",
        file: deliveryDocPath,
        message: `Authority design must document forbidden edge: ${edge.from} → ${edge.to}`,
      });
    }
  }

  return violations;
}

export function collectAuthorityDesignViolations(
  repoRoot: string
): AuthorityDesignEnforcementViolation[] {
  const violations: AuthorityDesignEnforcementViolation[] = [];
  const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);

  if (!existsSync(deliveryDocPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `${TIP_007_012_DELIVERY_DOC} is required for Step 3 authority design`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryDocPath, "utf8");
  const sectionHeading = `## ${TIP_007_012_AUTHORITY_DESIGN_SECTION}`;
  const authoritySection = extractSection(deliveryContent, sectionHeading);

  if (authoritySection === null) {
    violations.push({
      rule: "authority-section-missing",
      file: deliveryDocPath,
      message: `Delivery doc missing section: ${sectionHeading}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_AUTHORITY_DESIGN_DIMENSIONS) {
    if (!authoritySection.includes(dimension.tableMarker)) {
      violations.push({
        rule: "authority-table-missing",
        file: deliveryDocPath,
        message: `Step 3 missing authority table: ${dimension.tableMarker}`,
      });
    }
  }

  violations.push(
    ...collectMissingMarkers(
      authoritySection,
      MULTI_TENANCY_PACKAGE_OWNERSHIP_ROW_MARKERS,
      "package-ownership-row-missing",
      deliveryDocPath,
      "Package ownership"
    ),
    ...collectMissingMarkers(
      authoritySection,
      MULTI_TENANCY_DEPENDENCY_EDGE_ROW_MARKERS,
      "dependency-edge-row-missing",
      deliveryDocPath,
      "Dependency edges"
    ),
    ...collectMissingMarkers(
      authoritySection,
      MULTI_TENANCY_KERNEL_CONTRACT_ROW_MARKERS,
      "kernel-contract-row-missing",
      deliveryDocPath,
      "Kernel contracts"
    ),
    ...collectMissingMarkers(
      authoritySection,
      MULTI_TENANCY_DATABASE_PERSISTENCE_ROW_MARKERS,
      "database-persistence-row-missing",
      deliveryDocPath,
      "Database persistence"
    ),
    ...collectMissingMarkers(
      authoritySection,
      MULTI_TENANCY_ERP_OWNERSHIP_ROW_MARKERS,
      "erp-ownership-row-missing",
      deliveryDocPath,
      "ERP application ownership"
    )
  );

  violations.push(
    ...collectRegistryOwnershipViolations(deliveryContent, deliveryDocPath)
  );
  violations.push(...collectArtifactViolations(repoRoot));
  violations.push(...collectRegistryArtifactViolations(repoRoot));
  violations.push(...collectRegistryBaselineViolations(repoRoot));

  return violations;
}
