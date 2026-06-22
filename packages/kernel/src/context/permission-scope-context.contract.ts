export const PERMISSION_GRANT_SCOPE_TYPES = [
  "platform",
  "tenant",
  "entity_group",
  "company",
  "organization",
  "team",
  "project",
  "consolidation_view",
  "cross_company",
] as const;

export type PermissionGrantScopeType =
  (typeof PERMISSION_GRANT_SCOPE_TYPES)[number];

/** Explicit elevation flags — cross-company and consolidation access require these. */
export interface PermissionGrantElevationFlags {
  readonly consolidationView: boolean;
  readonly crossCompany: boolean;
  readonly minorityInterestCompany: boolean;
  readonly platformAdmin: boolean;
}

export const DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS: PermissionGrantElevationFlags =
  {
    consolidationView: false,
    crossCompany: false,
    minorityInterestCompany: false,
    platformAdmin: false,
  };

/** Resolved grant dimensions passed to `requirePermission()`. */
export interface PermissionScopeContext {
  readonly companyId: string | null;
  readonly elevations: PermissionGrantElevationFlags;
  readonly entityGroupId: string | null;
  readonly grantScopeType: PermissionGrantScopeType;
  readonly membershipId: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly roleId: string;
  readonly teamId: string | null;
  readonly tenantId: string;
}
