/**
 * Canonical permissions surface registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Permissions, lines 403–409).
 */
export const PERMISSIONS_SCOPE_GRANTS_MODULES = [
  {
    directory: "scope",
    glossaryTerm: "Membership scope resolution",
    status: "implemented",
    requiredFiles: [
      "membership.contract.ts",
      "role-scope.contract.ts",
      "grant-scope-resolution.ts",
      "membership-resolution.ts",
      "index.ts",
    ] as const,
  },
  {
    directory: "grants",
    glossaryTerm: "RLS Grant / permission enforcement",
    status: "implemented",
    requiredFiles: [
      "permission.contract.ts",
      "permission-checker.ts",
      "role.contract.ts",
      "index.ts",
    ] as const,
  },
] as const;

export type PermissionsScopeGrantsModule =
  (typeof PERMISSIONS_SCOPE_GRANTS_MODULES)[number]["directory"];

/** Directories that must expose an index.ts barrel. */
export const PERMISSIONS_SCOPE_GRANTS_BARREL_DIRECTORIES =
  PERMISSIONS_SCOPE_GRANTS_MODULES.map((module) => module.directory);

/** Flat legacy modules removed from package root — use scope/ or grants/ barrels. */
export const PERMISSIONS_LEGACY_FLAT_MODULES = [
  "membership.contract.ts",
  "grant-scope-resolution.ts",
  "membership-resolution.ts",
  "permission.contract.ts",
  "permission-checker.ts",
  "role.contract.ts",
] as const;

/**
 * Membership scope tiers implemented today (`memberships.scope_type`).
 * Planned tiers remain registry-only until TIP-008 / TIP-030 land.
 */
export const PERMISSIONS_IMPLEMENTED_MEMBERSHIP_SCOPES = [
  "tenant",
  "company",
  "organization",
] as const;

export type PermissionsImplementedMembershipScope =
  (typeof PERMISSIONS_IMPLEMENTED_MEMBERSHIP_SCOPES)[number];

/** Planned membership scope extensions — authority stubs only. */
export const PERMISSIONS_PLANNED_MEMBERSHIP_SCOPES = [
  {
    scopeType: "entity_group",
    tip: "TIP-008",
    status: "planned",
    grantsAccessTo: "All Legal Entities in the Entity Group",
  },
  {
    scopeType: "project",
    tip: "TIP-030",
    status: "planned",
    grantsAccessTo: "Project-scoped records only",
  },
] as const;

/**
 * Allowed dependency direction between barrels.
 * scope must not import grants — grants may import scope for enforcement.
 */
export const PERMISSIONS_BARREL_DEPENDENCY_RULE =
  "grants-may-import-scope; scope-must-not-import-grants" as const;
