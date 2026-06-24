/**
 * Canonical Step 4 context contracts registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 4, lines 522–536).
 *
 * Runtime contract files live in `packages/kernel/src/context/`.
 * Enforcement in `lib/multi-tenancy-context-contracts-enforcement.mts`.
 */
import {
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
  type KernelOperatingContextPrimaryType,
} from "../../packages/kernel/src/context/context-registry.ts";

export const MULTI_TENANCY_CONTEXT_CONTRACTS_SURFACE_RULE =
  "multi-tenancy-context-contracts-are-canonical-serializable-kernel-boundary" as const;

/** Markers that must appear in multi-tenancy.md Step 4 (§522–536). */
export const MULTI_TENANCY_DOC_CONTEXT_CONTRACTS_MARKERS = [
  "Step 4 — Context contracts",
  "Add or update serializable kernel contracts:",
  "TenantContext",
  "EntityGroupContext",
  "LegalEntityContext",
  "OwnershipInterestContext",
  "OrganizationUnitContext",
  "TeamContext",
  "ProjectContext",
  "PermissionScopeContext",
  "ConsolidationScopeContext",
  "OperatingContext",
  "Ensure public export maps are updated.",
] as const;

/** Delivery doc H2 — must match `TIP_007_012_REQUIRED_SECTIONS` entry. */
export const TIP_007_012_CONTEXT_CONTRACTS_SECTION =
  "Context contracts" as const;

/** Step 4 dimensions — serializable contracts + export maps. */
export const MULTI_TENANCY_CONTEXT_CONTRACTS_DIMENSIONS = [
  {
    id: "required-contracts",
    title: "Required serializable contracts",
    tableMarker: "### Required serializable contracts",
    registryImport: "packages/kernel/src/context/context-registry.ts",
    registryExport: "KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES",
  },
  {
    id: "context-export-map",
    title: "Context barrel export map",
    tableMarker: "### Context barrel export map",
    artifactPath: "packages/kernel/src/context/index.ts",
  },
  {
    id: "root-export-map",
    title: "Root package export map",
    tableMarker: "### Root package export map",
    artifactPath: "packages/kernel/src/index.ts",
  },
  {
    id: "operating-context-composition",
    title: "OperatingContext composition",
    tableMarker: "### OperatingContext composition",
    artifactPath: "packages/kernel/src/context/operating-context.contract.ts",
  },
] as const;

/** All Step 4 primary contract types (§525–535). */
export const MULTI_TENANCY_STEP4_PRIMARY_TYPES = [
  "TenantContext",
  "EntityGroupContext",
  "LegalEntityContext",
  "OwnershipInterestContext",
  "OrganizationUnitContext",
  "TeamContext",
  "ProjectContext",
  "PermissionScopeContext",
  "ConsolidationScopeContext",
  "OperatingContext",
] as const satisfies readonly KernelOperatingContextPrimaryType[];

/** Required contract row markers in delivery doc. */
export const MULTI_TENANCY_CONTEXT_CONTRACT_ROW_MARKERS =
  MULTI_TENANCY_STEP4_PRIMARY_TYPES.map((type) => `| ${type} |`) as readonly [
    `| ${string} |`,
    ...`| ${string} |`[],
  ];

/** Required root re-export markers. */
export const MULTI_TENANCY_ROOT_EXPORT_MARKERS = [
  "KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES",
  "deriveConsolidationScopeContext",
  "OPERATING_CONTEXT_ERROR_CODES",
] as const;

/** Patterns forbidden in contract interfaces — non-serializable boundary types. */
export const MULTI_TENANCY_FORBIDDEN_CONTRACT_TYPE_PATTERNS = [
  ": Date",
  ": Date |",
  ": Date;",
  "Map<",
  "Set<",
  "bigint",
] as const;

export { KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES };

export const MULTI_TENANCY_CONTEXT_CONTRACTS_GATE =
  "scripts/governance/check-multi-tenancy-context-contracts.mts" as const;

export const MULTI_TENANCY_CONTEXT_CONTRACTS_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-context-contracts-enforcement.mts" as const;
