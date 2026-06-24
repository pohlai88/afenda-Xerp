/**
 * Canonical operating-context module registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 4 §522–536, Kernel §354–369).
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
  "untrusted-client-authority.contract.ts",
  "app-shell-context.contract.ts",
  "accounting-readiness.contract.ts",
  "consolidation-scope-resolution.server.ts",
  "consolidation-scope-investee-merge.policy.ts",
  "enterprise-hierarchy.contract.ts",
  "runtime-module-path.ts",
] as const;

export type KernelOperatingContextRequiredModule =
  (typeof KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES)[number]["file"];

export type KernelOperatingContextPrimaryType =
  (typeof KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES)[number]["primaryType"];
