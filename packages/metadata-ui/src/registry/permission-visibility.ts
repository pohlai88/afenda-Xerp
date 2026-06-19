import type { PermissionKey } from "@afenda/permissions";
import type { MetadataActionContract } from "../contracts/metadata-action.contract";
import type {
  MetadataPermissionRequirement,
  MetadataVisibilityContext,
  MetadataVisibilityResolution,
} from "../contracts/metadata-permission.contract";

export const resolveMetadataVisibility = (
  requirement: MetadataPermissionRequirement | undefined,
  context: MetadataVisibilityContext
): MetadataVisibilityResolution => {
  if (!requirement) {
    return {
      allowed: true,
      effect: null,
      reason: null,
    };
  }

  const grantedPermissions = new Set<PermissionKey>(context.grantedPermissions);
  const allowed = grantedPermissions.has(requirement.permissionKey);

  return {
    allowed,
    effect: allowed ? null : requirement.denialEffect,
    reason: allowed ? null : requirement.reason,
  };
};

export const resolveMetadataActions = (
  actions: readonly MetadataActionContract[],
  context: MetadataVisibilityContext
): readonly MetadataActionContract[] =>
  actions.filter((action) => {
    const resolution = resolveMetadataVisibility(action.permission, context);
    return resolution.allowed || resolution.effect === "disable";
  });
