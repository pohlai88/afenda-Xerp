/**
 * Permission grant vocabulary — cross-package scope dimension words only (PAS-001 §8).
 * Resolved membership/role records belong in `@afenda/permissions`; kernel retains vocabulary
 * until OperatingContext composition migrates (TIP-007 transitional).
 */

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

export function isPermissionGrantScopeType(
  value: string
): value is PermissionGrantScopeType {
  return (PERMISSION_GRANT_SCOPE_TYPES as readonly string[]).includes(value);
}
