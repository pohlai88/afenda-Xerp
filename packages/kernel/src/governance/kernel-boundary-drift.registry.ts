/**
 * PAS-001 — kernel boundary drift registry (refactor lock).
 *
 * Lists source paths that currently live under `packages/kernel/src` but are
 * scheduled for removal, relocation, rename, or quarantine per PAS-001.
 * Authority-only metadata — no runtime enforcement until a serialized slice
 * executes each entry.
 *
 * Canonical standard: docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md
 */

import type { RepoRelativePath } from "../contracts/platform/platform-entity-authority.contract.js";

export const KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS = {
  identityFloor: "4.1.6",
  businessReference: "4.7",
  prohibitedOwnership: "5",
  packageStructure: "6.2",
  implementationSequence: "11",
  doctrine: "15",
} as const;

export const KERNEL_BOUNDARY_DRIFT_DISPOSITIONS = [
  "remove_after_migration",
  "relocate",
  "rename_in_place",
  "consolidate_in_kernel",
  "quarantine_subpath_only",
] as const;

export type KernelBoundaryDriftDisposition =
  (typeof KERNEL_BOUNDARY_DRIFT_DISPOSITIONS)[number];

export const KERNEL_BOUNDARY_DRIFT_REFACTOR_STATUSES = [
  "pending",
  "completed",
] as const;

export type KernelBoundaryDriftRefactorStatus =
  (typeof KERNEL_BOUNDARY_DRIFT_REFACTOR_STATUSES)[number];

export const KERNEL_BOUNDARY_DRIFT_ENTRY_IDS = [
  "contracts-brand-shim",
  "legacy-brand-boundary",
  "business-master-data-authority",
  "business-master-data-shared-package-policy",
  "business-master-data-import-boundary",
  "business-master-data-folder-rename",
  "business-master-data-id-boundary-overlap",
  "accounting-id-forbidden-floor-symbols",
  "permission-scope-context-transitional",
  "accounting-domain-bridge-projection",
  "untrusted-client-authority-transport",
  "consolidation-scope-resolution-transport",
  "runtime-module-path-transport",
] as const;

export type KernelBoundaryDriftEntryId =
  (typeof KERNEL_BOUNDARY_DRIFT_ENTRY_IDS)[number];

export interface KernelBoundaryDriftEntry {
  readonly disposition: KernelBoundaryDriftDisposition;
  readonly id: KernelBoundaryDriftEntryId;
  readonly kernelPath: RepoRelativePath;
  readonly ownerTarget: string;
  readonly pasSection: string;
  readonly rationale: string;
  readonly refactorLock: true;
  readonly refactorStatus: KernelBoundaryDriftRefactorStatus;
}

export const KERNEL_BOUNDARY_DRIFT_ENTRIES = {
  "contracts-brand-shim": {
    id: "contracts-brand-shim",
    kernelPath: "packages/kernel/src/contracts/brand.contract.ts",
    disposition: "remove_after_migration",
    ownerTarget: "packages/kernel/src/identity/brand/ (canonical)",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.doctrine,
    rationale:
      "Duplicate compatibility re-export. Canonical Brand surface is identity/brand/ — PAS §9 rule 11 (no duplicated contract pattern).",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "legacy-brand-boundary": {
    id: "legacy-brand-boundary",
    kernelPath:
      "packages/kernel/src/identity/governance/legacy-brand-boundary.contract.ts",
    disposition: "remove_after_migration",
    ownerTarget: "(delete — family parse* only)",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.identityFloor,
    rationale:
      "Trim-only brandRequiredId/brandOptionalId helpers do not satisfy §4.1 enterprise ID boundary. Retained for migration tests only; excluded from public barrels.",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "business-master-data-authority": {
    id: "business-master-data-authority",
    kernelPath:
      "packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts",
    disposition: "relocate",
    ownerTarget: "@afenda/architecture-authority",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.businessReference,
    rationale:
      "PKG-R02–R05 domain package routing and runtimeStatus metadata is architecture disposition — not cross-package vocabulary. Kernel owns reference IDs (§4.7 id-only); not domain package scaffolding.",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "business-master-data-shared-package-policy": {
    id: "business-master-data-shared-package-policy",
    kernelPath:
      "packages/kernel/src/contracts/business-master-data/business-master-data-shared-package.policy.ts",
    disposition: "relocate",
    ownerTarget: "@afenda/architecture-authority",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.prohibitedOwnership,
    rationale:
      "Persistence ownership policy for reserved packages (@afenda/database vs CRM/HRM) is foundation disposition — ADR-0020 scaffold already lives in architecture-authority.",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "business-master-data-import-boundary": {
    id: "business-master-data-import-boundary",
    kernelPath:
      "packages/kernel/src/contracts/business-master-data/business-master-data-import-boundary.policy.ts",
    disposition: "relocate",
    ownerTarget: "scripts/governance/ or @afenda/architecture-authority",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.prohibitedOwnership,
    rationale:
      "Import-prefix guard for domain contracts is governance enforcement — not kernel vocabulary.",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "business-master-data-folder-rename": {
    id: "business-master-data-folder-rename",
    kernelPath: "packages/kernel/src/contracts/business-reference-identity/",
    disposition: "rename_in_place",
    ownerTarget:
      "packages/kernel/src/identity/wire/business-reference-wire.contract.ts",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.businessReference,
    rationale:
      'PAS §4.7 rename guidance: prefer "Business Reference Identity Authority" over "Business Master Data Authority". Folder name is legacy TIP-008B vocabulary.',
    refactorLock: true,
    refactorStatus: "completed",
  },
  "business-master-data-id-boundary-overlap": {
    id: "business-master-data-id-boundary-overlap",
    kernelPath:
      "packages/kernel/src/contracts/business-reference-identity/business-reference-id-boundary.contract.ts",
    disposition: "consolidate_in_kernel",
    ownerTarget:
      "packages/kernel/src/identity/wire/business-reference-wire.contract.ts",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.businessReference,
    rationale:
      "Wire reference shapes duplicate identity/families and wire ingress — consolidate during rename slice; kernel keeps id-only surface.",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "accounting-id-forbidden-floor-symbols": {
    id: "accounting-id-forbidden-floor-symbols",
    kernelPath:
      "packages/kernel/src/contracts/accounting-domain/accounting-id.contract.ts",
    disposition: "quarantine_subpath_only",
    ownerTarget: "@afenda/accounting (when ADR promotes fiscal domain IDs)",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.identityFloor,
    rationale:
      "FiscalCalendarId / FiscalPeriodId are §4.1.6 forbidden platform-floor IDs. Quarantined on @afenda/kernel/accounting-domain until Finance ADR promotes — must never join ID_FAMILIES.",
    refactorLock: true,
    refactorStatus: "pending",
  },
  "permission-scope-context-transitional": {
    id: "permission-scope-context-transitional",
    kernelPath:
      "packages/kernel/src/context/permission-scope-context.contract.ts",
    disposition: "relocate",
    ownerTarget:
      "packages/permissions/src/scope/permission-scope-context.contract.ts",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.prohibitedOwnership,
    rationale:
      "Resolved grant scope passed to requirePermission() is authorization runtime shape — kernel keeps grant vocabulary (permission-grant-vocabulary.contract.ts) per §8; evaluation owner is @afenda/permissions.",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "accounting-domain-bridge-projection": {
    id: "accounting-domain-bridge-projection",
    kernelPath:
      "packages/kernel/src/contracts/accounting-domain/bridge/to-accounting-domain-context.ts",
    disposition: "relocate",
    ownerTarget: "apps/erp/src/lib/accounting-readiness.projection.ts",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.prohibitedOwnership,
    rationale:
      "Pure readiness→wire projection belongs with other accounting-readiness projections (package-structure.md: toAccountingReadinessContext / resolveReportingCurrency → apps/erp). Delivered in kernel temporarily (b15-4.8).",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "untrusted-client-authority-transport": {
    id: "untrusted-client-authority-transport",
    kernelPath:
      "packages/kernel/src/context/untrusted-client-authority.contract.ts",
    disposition: "relocate",
    ownerTarget: "apps/erp (API ingress) or API governance package",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.prohibitedOwnership,
    rationale:
      "Request-body authority field scanning is transport/API ingress enforcement (§5 api-route-handlers / server-actions owner) — not cross-package vocabulary.",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "consolidation-scope-resolution-transport": {
    id: "consolidation-scope-resolution-transport",
    kernelPath: "packages/kernel/src/context/consolidation-scope-resolution.ts",
    disposition: "relocate",
    ownerTarget:
      "apps/erp/src/lib/context/consolidation-scope-resolution.server.ts",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.prohibitedOwnership,
    rationale:
      "deriveConsolidationScopeContext is operating-context derivation — PAS §4.4 resolver owner is apps/erp, not kernel.",
    refactorLock: true,
    refactorStatus: "completed",
  },
  "runtime-module-path-transport": {
    id: "runtime-module-path-transport",
    kernelPath: "packages/kernel/src/context/runtime-module-path.ts",
    disposition: "relocate",
    ownerTarget:
      "apps/erp/src/lib/context/runtime-module-path.server.ts (+ surface/workflow resolution)",
    pasSection: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS.prohibitedOwnership,
    rationale:
      "Surface/workflow path normalization and parse/to helpers are ERP resolver behavior — kernel keeps SurfaceContext/WorkflowContext shapes only.",
    refactorLock: true,
    refactorStatus: "completed",
  },
} satisfies Record<KernelBoundaryDriftEntryId, KernelBoundaryDriftEntry>;

/** Repo-relative paths confirmed IN kernel per PAS-001 (audit negatives). */
export const KERNEL_BOUNDARY_CANONICAL_PRIMITIVE_PATHS = [
  "packages/kernel/src/identity/primitives/country-code.contract.ts",
  "packages/kernel/src/identity/primitives/locale-code.contract.ts",
  "packages/kernel/src/identity/primitives/timezone-id.contract.ts",
  "packages/kernel/src/identity/primitives/date-format.contract.ts",
  "packages/kernel/src/identity/primitives/number-format.contract.ts",
  "packages/kernel/src/identity/primitives/currency-code.contract.ts",
  "packages/kernel/src/identity/primitives/uom-code.contract.ts",
] as const satisfies readonly RepoRelativePath[];

export const KERNEL_BOUNDARY_DRIFT_POLICY = {
  pasSections: KERNEL_BOUNDARY_DRIFT_PAS_SECTIONS,
  entryCount: KERNEL_BOUNDARY_DRIFT_ENTRY_IDS.length,
  constitutionalRule:
    "If it describes a cross-package fact or primitive vocabulary, it may belong in kernel. If it decides, loads, calculates, formats, evaluates, renders, persists, or executes, it belongs outside kernel (PAS-001 §15).",
  refactorLockActive: true,
} as const;

const ENTRY_ID_SET = new Set<string>(KERNEL_BOUNDARY_DRIFT_ENTRY_IDS);

export function isKernelBoundaryDriftEntryId(
  value: string
): value is KernelBoundaryDriftEntryId {
  return ENTRY_ID_SET.has(value);
}

export function getKernelBoundaryDriftEntry(
  id: KernelBoundaryDriftEntryId
): KernelBoundaryDriftEntry {
  return KERNEL_BOUNDARY_DRIFT_ENTRIES[id];
}

export function listKernelBoundaryDriftEntries(): readonly KernelBoundaryDriftEntry[] {
  return KERNEL_BOUNDARY_DRIFT_ENTRY_IDS.map(
    (id) => KERNEL_BOUNDARY_DRIFT_ENTRIES[id]
  );
}

export function isKernelBoundaryDriftPath(repoRelativePath: string): boolean {
  return KERNEL_BOUNDARY_DRIFT_ENTRY_IDS.some((id) => {
    const entry = KERNEL_BOUNDARY_DRIFT_ENTRIES[id];
    return (
      repoRelativePath === entry.kernelPath ||
      (entry.kernelPath.endsWith("/") &&
        repoRelativePath.startsWith(entry.kernelPath))
    );
  });
}
