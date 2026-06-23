/**
 * Shared Step 4 context contracts enforcement (multi-tenancy.md §522–536).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
} from "../../../packages/kernel/src/context/context-registry.ts";
import {
  MULTI_TENANCY_CONTEXT_CONTRACT_ROW_MARKERS,
  MULTI_TENANCY_CONTEXT_CONTRACTS_DIMENSIONS,
  MULTI_TENANCY_FORBIDDEN_CONTRACT_TYPE_PATTERNS,
  MULTI_TENANCY_ROOT_EXPORT_MARKERS,
  MULTI_TENANCY_STEP4_PRIMARY_TYPES,
  TIP_007_012_CONTEXT_CONTRACTS_SECTION,
} from "../multi-tenancy-context-contracts-registry.mts";
import { TIP_007_012_DELIVERY_DOC } from "../delivery-evidence-surface-registry.mts";

export interface ContextContractsEnforcementViolation {
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

function collectMissingMarkers(
  content: string,
  markers: readonly string[],
  rule: string,
  file: string,
  label: string
): ContextContractsEnforcementViolation[] {
  const violations: ContextContractsEnforcementViolation[] = [];

  for (const marker of markers) {
    if (!content.includes(marker)) {
      violations.push({
        rule,
        file,
        message: `${label} missing row marker: ${marker}`,
      });
    }
  }

  return violations;
}

function collectRequiredModuleViolations(
  repoRoot: string
): ContextContractsEnforcementViolation[] {
  const violations: ContextContractsEnforcementViolation[] = [];
  const contextRoot = join(repoRoot, "packages/kernel/src/context");

  for (const entry of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
    const contractPath = join(contextRoot, entry.file);

    if (!existsSync(contractPath)) {
      violations.push({
        rule: "contract-file-missing",
        file: contractPath,
        message: `Step 4 contract file missing: ${entry.file}`,
      });
      continue;
    }

    const contractSource = readFileSync(contractPath, "utf8");

    if (!contractSource.includes(`interface ${entry.primaryType}`)) {
      violations.push({
        rule: "contract-interface-missing",
        file: contractPath,
        message: `Step 4 contract interface missing: ${entry.primaryType}`,
      });
    }

    if (!entry.file.endsWith(".contract.ts")) {
      violations.push({
        rule: "contract-file-naming",
        file: contractPath,
        message: `Step 4 contract files must use *.contract.ts: ${entry.file}`,
      });
    }

    for (const forbidden of MULTI_TENANCY_FORBIDDEN_CONTRACT_TYPE_PATTERNS) {
      if (contractSource.includes(forbidden)) {
        violations.push({
          rule: "contract-non-serializable-type",
          file: contractPath,
          message: `Step 4 contract must remain JSON-serializable — found ${forbidden}`,
        });
      }
    }
  }

  const registryPrimaryTypes = KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES.map(
    (entry) => entry.primaryType
  );

  for (const primaryType of MULTI_TENANCY_STEP4_PRIMARY_TYPES) {
    if (!registryPrimaryTypes.includes(primaryType)) {
      violations.push({
        rule: "registry-primary-type-missing",
        file: join(contextRoot, "context-registry.ts"),
        message: `KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES missing ${primaryType}`,
      });
    }
  }

  return violations;
}

function collectExportMapViolations(
  repoRoot: string
): ContextContractsEnforcementViolation[] {
  const violations: ContextContractsEnforcementViolation[] = [];
  const contextIndexPath = join(
    repoRoot,
    "packages/kernel/src/context/index.ts"
  );
  const rootIndexPath = join(repoRoot, "packages/kernel/src/index.ts");

  if (!existsSync(contextIndexPath)) {
    violations.push({
      rule: "context-index-missing",
      file: contextIndexPath,
      message: "packages/kernel/src/context/index.ts is required",
    });
    return violations;
  }

  const contextIndexSource = readFileSync(contextIndexPath, "utf8");

  for (const primaryType of MULTI_TENANCY_STEP4_PRIMARY_TYPES) {
    if (!contextIndexSource.includes(`type ${primaryType}`)) {
      violations.push({
        rule: "context-barrel-export-missing",
        file: contextIndexPath,
        message: `context/index.ts must export type ${primaryType}`,
      });
    }
  }

  if (!existsSync(rootIndexPath)) {
    violations.push({
      rule: "kernel-root-index-missing",
      file: rootIndexPath,
      message: "packages/kernel/src/index.ts is required",
    });
    return violations;
  }

  const rootIndexSource = readFileSync(rootIndexPath, "utf8");

  for (const primaryType of MULTI_TENANCY_STEP4_PRIMARY_TYPES) {
    if (!rootIndexSource.includes(`type ${primaryType}`)) {
      violations.push({
        rule: "kernel-root-export-missing",
        file: rootIndexPath,
        message: `packages/kernel/src/index.ts must re-export type ${primaryType}`,
      });
    }
  }

  for (const marker of MULTI_TENANCY_ROOT_EXPORT_MARKERS) {
    if (!rootIndexSource.includes(marker)) {
      violations.push({
        rule: "kernel-root-registry-export-missing",
        file: rootIndexPath,
        message: `packages/kernel/src/index.ts must export ${marker}`,
      });
    }
  }

  const operatingContextPath = join(
    repoRoot,
    "packages/kernel/src/context/operating-context.contract.ts"
  );
  if (existsSync(operatingContextPath)) {
    const operatingSource = readFileSync(operatingContextPath, "utf8");
    const compositionFields = [
      "readonly tenant: TenantContext",
      "readonly entityGroup: EntityGroupContext",
      "readonly legalEntity: LegalEntityContext",
      "readonly ownershipInterests: readonly OwnershipInterestContext[]",
      "readonly organizationUnit: OrganizationUnitContext",
      "readonly team: TeamContext",
      "readonly project: ProjectContext",
      "readonly permissionScope: PermissionScopeContext",
      "readonly consolidationScope: ConsolidationScopeContext",
    ] as const;

    for (const field of compositionFields) {
      if (!operatingSource.includes(field)) {
        violations.push({
          rule: "operating-context-composition-missing",
          file: operatingContextPath,
          message: `OperatingContext missing composition field: ${field}`,
        });
      }
    }
  }

  const accountingPath = join(
    repoRoot,
    "packages/kernel/src/context/accounting-readiness.contract.ts"
  );
  if (existsSync(accountingPath)) {
    const accountingSource = readFileSync(accountingPath, "utf8");
    if (
      accountingSource.includes('from "./index.js"') ||
      accountingSource.includes("from './index.js'")
    ) {
      violations.push({
        rule: "context-circular-import",
        file: accountingPath,
        message: "accounting-readiness.contract.ts must not import context/index.js",
      });
    }
  }

  return violations;
}

export function collectContextContractsViolations(
  repoRoot: string
): ContextContractsEnforcementViolation[] {
  const violations: ContextContractsEnforcementViolation[] = [];
  const deliveryDocPath = join(repoRoot, TIP_007_012_DELIVERY_DOC);

  if (!existsSync(deliveryDocPath)) {
    violations.push({
      rule: "delivery-doc-missing",
      file: deliveryDocPath,
      message: `${TIP_007_012_DELIVERY_DOC} is required for Step 4 context tables`,
    });
    return violations;
  }

  const deliveryContent = readFileSync(deliveryDocPath, "utf8");
  const sectionHeading = `## ${TIP_007_012_CONTEXT_CONTRACTS_SECTION}`;
  const contextSection = extractSection(deliveryContent, sectionHeading);

  if (contextSection === null) {
    violations.push({
      rule: "context-contracts-section-missing",
      file: deliveryDocPath,
      message: `Delivery doc missing section: ${sectionHeading}`,
    });
    return violations;
  }

  for (const dimension of MULTI_TENANCY_CONTEXT_CONTRACTS_DIMENSIONS) {
    if (!contextSection.includes(dimension.tableMarker)) {
      violations.push({
        rule: "context-contracts-table-missing",
        file: deliveryDocPath,
        message: `Step 4 missing table: ${dimension.tableMarker}`,
      });
    }
  }

  violations.push(
    ...collectMissingMarkers(
      contextSection,
      MULTI_TENANCY_CONTEXT_CONTRACT_ROW_MARKERS,
      "context-contract-row-missing",
      deliveryDocPath,
      "Required serializable contracts"
    )
  );

  violations.push(...collectRequiredModuleViolations(repoRoot));
  violations.push(...collectExportMapViolations(repoRoot));

  return violations;
}
