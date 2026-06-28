/**
 * Shared Step 2 existing-state audit enforcement (multi-tenancy.md §502–511).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { APPSHELL_CONTEXT_CONSUMPTION_MODULES } from "../../../packages/appshell/src/context/appshell-context-surface-registry.ts";
import { DATABASE_TENANT_DOMAIN_MODULES } from "../../../packages/database/src/tenant-domain/tenant-domain-registry.ts";
import { KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES } from "../../../packages/kernel/src/context/context-registry.ts";
import { PERMISSIONS_SCOPE_GRANTS_MODULES } from "../../../packages/permissions/src/permissions-scope-grants-registry.ts";
import { MULTI_TENANCY_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";
import {
  MULTI_TENANCY_API_ACTIONS_AUDIT_ROW_MARKERS,
  MULTI_TENANCY_APPSHELL_CONTEXT_AUDIT_ROW_MARKERS,
  MULTI_TENANCY_AUDIT_STATUS_VALUES,
  MULTI_TENANCY_EXISTING_STATE_AUDIT_DIMENSIONS,
  MULTI_TENANCY_KERNEL_CONTEXT_AUDIT_ROW_MARKERS,
  MULTI_TENANCY_PERMISSION_GRANT_AUDIT_ROW_MARKERS,
  MULTI_TENANCY_SCHEMA_AUDIT_ROW_MARKERS,
  MULTI_TENANCY_TENANT_SUBDOMAIN_AUDIT_ROW_MARKERS,
  MULTI_TENANCY_EXISTING_STATE_AUDIT_SECTION,
} from "../multi-tenancy-existing-state-audit-registry.mts";

export interface ExistingStateAuditEnforcementViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function sectionIncludesStatusValue(section: string): boolean {
  const lower = section.toLowerCase();
  return MULTI_TENANCY_AUDIT_STATUS_VALUES.some((status) =>
    lower.includes(status)
  );
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
): ExistingStateAuditEnforcementViolation[] {
  const violations: ExistingStateAuditEnforcementViolation[] = [];

  for (const marker of markers) {
    if (!content.includes(marker)) {
      violations.push({
        rule,
        file,
        message: `${label} audit table missing row marker: ${marker}`,
      });
    }
  }

  return violations;
}

function collectArtifactViolations(
  repoRoot: string
): ExistingStateAuditEnforcementViolation[] {
  const violations: ExistingStateAuditEnforcementViolation[] = [];

  for (const dimension of MULTI_TENANCY_EXISTING_STATE_AUDIT_DIMENSIONS) {
    if (!("artifactPaths" in dimension)) {
      continue;
    }

    for (const relativePath of dimension.artifactPaths) {
      const absolutePath = join(repoRoot, relativePath);
      if (!existsSync(absolutePath)) {
        violations.push({
          rule: "audit-artifact-missing",
          file: absolutePath,
          message: `${dimension.id} audit requires artifact: ${relativePath}`,
        });
      }
    }
  }

  return violations;
}

function collectRegistryArtifactViolations(
  repoRoot: string
): ExistingStateAuditEnforcementViolation[] {
  const violations: ExistingStateAuditEnforcementViolation[] = [];

  for (const dimension of MULTI_TENANCY_EXISTING_STATE_AUDIT_DIMENSIONS) {
    if (!("registryImport" in dimension)) {
      continue;
    }

    const absolutePath = join(repoRoot, dimension.registryImport);
    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "audit-registry-missing",
        file: absolutePath,
        message: `${dimension.id} audit registry missing: ${dimension.registryImport}`,
      });
    }
  }

  return violations;
}

function collectRegistryBaselineViolations(
  repoRoot: string
): ExistingStateAuditEnforcementViolation[] {
  const violations: ExistingStateAuditEnforcementViolation[] = [];

  for (const module of DATABASE_TENANT_DOMAIN_MODULES) {
    const schemaPath = join(
      repoRoot,
      "packages/database/src",
      module.directory,
      "index.ts"
    );

    if (!existsSync(schemaPath)) {
      violations.push({
        rule: "schema-module-missing",
        file: schemaPath,
        message: `Tenant-domain module barrel missing for ${module.glossaryTerm}`,
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
        message: `Kernel context contract missing: ${module.primaryType}`,
      });
    }
  }

  for (const module of PERMISSIONS_SCOPE_GRANTS_MODULES) {
    const barrelPath = join(
      repoRoot,
      "packages/permissions/src",
      module.directory,
      "index.ts"
    );

    if (!existsSync(barrelPath)) {
      violations.push({
        rule: "permissions-barrel-missing",
        file: barrelPath,
        message: `Permissions barrel missing: ${module.directory}`,
      });
    }
  }

  for (const module of APPSHELL_CONTEXT_CONSUMPTION_MODULES) {
    const modulePath = join(repoRoot, "packages/appshell/src", module.path);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "appshell-module-missing",
        file: modulePath,
        message: `AppShell context module missing: ${module.path}`,
      });
    }
  }

  return violations;
}

export function collectExistingStateAuditViolations(
  repoRoot: string
): ExistingStateAuditEnforcementViolation[] {
  const violations: ExistingStateAuditEnforcementViolation[] = [];
  const deliveryDocPath = join(repoRoot, MULTI_TENANCY_DELIVERY_DOC);

  if (!existsSync(deliveryDocPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `${MULTI_TENANCY_DELIVERY_DOC} is required for Step 2 audit tables`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryDocPath, "utf8");
  const sectionHeading = `## ${MULTI_TENANCY_EXISTING_STATE_AUDIT_SECTION}`;
  const auditSection = extractSection(deliveryContent, sectionHeading);

  if (auditSection === null) {
    violations.push({
      rule: "audit-section-missing",
      file: deliveryDocPath,
      message: `Delivery doc missing section: ${sectionHeading}`,
    });
    return violations;
  }

  if (!sectionIncludesStatusValue(auditSection)) {
    violations.push({
      rule: "audit-status-column-missing",
      file: deliveryDocPath,
      message: `${sectionHeading} must document implementation status before modifying`,
    });
  }

  for (const dimension of MULTI_TENANCY_EXISTING_STATE_AUDIT_DIMENSIONS) {
    if (!auditSection.includes(dimension.tableMarker)) {
      violations.push({
        rule: "audit-table-missing",
        file: deliveryDocPath,
        message: `Step 2 missing audit table: ${dimension.tableMarker}`,
      });
    }
  }

  violations.push(
    ...collectMissingMarkers(
      auditSection,
      MULTI_TENANCY_SCHEMA_AUDIT_ROW_MARKERS,
      "schema-audit-row",
      deliveryDocPath,
      "Schema"
    ),
    ...collectMissingMarkers(
      auditSection,
      MULTI_TENANCY_KERNEL_CONTEXT_AUDIT_ROW_MARKERS,
      "kernel-audit-row",
      deliveryDocPath,
      "Kernel context"
    ),
    ...collectMissingMarkers(
      auditSection,
      MULTI_TENANCY_PERMISSION_GRANT_AUDIT_ROW_MARKERS,
      "permission-audit-row",
      deliveryDocPath,
      "Permission/grant"
    ),
    ...collectMissingMarkers(
      auditSection,
      MULTI_TENANCY_APPSHELL_CONTEXT_AUDIT_ROW_MARKERS,
      "appshell-audit-row",
      deliveryDocPath,
      "AppShell context"
    ),
    ...collectMissingMarkers(
      auditSection,
      MULTI_TENANCY_TENANT_SUBDOMAIN_AUDIT_ROW_MARKERS,
      "subdomain-audit-row",
      deliveryDocPath,
      "Tenant subdomain"
    ),
    ...collectMissingMarkers(
      auditSection,
      MULTI_TENANCY_API_ACTIONS_AUDIT_ROW_MARKERS,
      "api-actions-audit-row",
      deliveryDocPath,
      "API/actions"
    )
  );

  violations.push(...collectArtifactViolations(repoRoot));
  violations.push(...collectRegistryArtifactViolations(repoRoot));
  violations.push(...collectRegistryBaselineViolations(repoRoot));

  return violations;
}
