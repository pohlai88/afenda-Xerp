/**
 * Canonical operating-context module registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 4 §522–536, Kernel §354–369).
 *
 * Naming (PAS-001 §4.4):
 * - `{layer}-context.contract.ts` — structural operating-context **shape** only
 * - `{scope}-scope-context.contract.ts` — grant/metadata scope slots on `OperatingContext`
 * - `operating-context.contract.ts` — composed operating context root
 * - `lifecycle.contract.ts` — shared lifecycle vocabulary for context shapes
 * - `permission-grant-vocabulary.contract.ts` — grant-scope words (not resolved scope records)
 * - `operating-context-hierarchy.contract.ts` / `enterprise-hierarchy.contract.ts` — layer metadata
 * - `hierarchy-id-boundary.contract.ts` — wire id parse/normalize at trust boundaries
 * - `*-resolution.ts` / `*.policy.ts` — derivation or merge **behavior** (owner: apps/erp; must not live here)
 */
export const KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES = [
  {
    file: "tenant-context.contract.ts",
    primaryType: "TenantContext",
  },
  {
    file: "entity-group-context.contract.ts",
    primaryType: "EntityGroupContext",
  },
  {
    file: "legal-entity-context.contract.ts",
    primaryType: "LegalEntityContext",
  },
  {
    file: "ownership-interest-context.contract.ts",
    primaryType: "OwnershipInterestContext",
  },
  {
    file: "organization-unit-context.contract.ts",
    primaryType: "OrganizationUnitContext",
  },
  {
    file: "team-context.contract.ts",
    primaryType: "TeamContext",
  },
  {
    file: "project-context.contract.ts",
    primaryType: "ProjectContext",
  },
  {
    file: "operating-context.contract.ts",
    primaryType: "OperatingContext",
  },
  {
    file: "permission-scope-context.contract.ts",
    primaryType: "PermissionScopeContext",
  },
  {
    file: "consolidation-scope-context.contract.ts",
    primaryType: "ConsolidationScopeContext",
  },
] as const;

/** Supporting contracts exported from the same package surface. */
export const KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES = [
  "lifecycle.contract.ts",
  "workspace-context.contract.ts",
  "surface-context.contract.ts",
  "workflow-context.contract.ts",
  "accounting-readiness-context.contract.ts",
  "hierarchy-id-boundary.contract.ts",
  "localization-context.contract.ts",
  "operating-context-hierarchy.contract.ts",
  "permission-grant-vocabulary.contract.ts",
  "enterprise-hierarchy.contract.ts",
] as const;

export type KernelOperatingContextRequiredModule =
  (typeof KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES)[number]["file"];

export type KernelOperatingContextPrimaryType =
  (typeof KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES)[number]["primaryType"];
