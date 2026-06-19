import type { PermissionKey } from "@afenda/permissions";

export const METADATA_VISIBILITY_EFFECTS = ["hide", "disable"] as const;

export type MetadataVisibilityEffect =
  (typeof METADATA_VISIBILITY_EFFECTS)[number];

export interface MetadataPermissionRequirement {
  readonly denialEffect: MetadataVisibilityEffect;
  readonly permissionKey: PermissionKey;
  readonly reason: string;
}

export interface MetadataVisibilityContext {
  readonly grantedPermissions: readonly PermissionKey[];
}

export interface MetadataVisibilityResolution {
  readonly allowed: boolean;
  readonly effect: MetadataVisibilityEffect | null;
  readonly reason: string | null;
}
