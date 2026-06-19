import type { PermissionKey } from "@afenda/permissions";
import type { MetadataActionContract } from "../contracts/metadata-action.contract";
import type {
  MetadataPermissionRequirement,
  MetadataVisibilityContext,
  MetadataVisibilityResolution,
} from "../contracts/metadata-permission.contract";

/**
 * Resolves whether a single permission requirement is satisfied within the
 * given visibility context.
 *
 * - No requirement → unconditionally allowed.
 * - Allowed → `{ allowed: true, effect: null, reason: null }`.
 * - Denied with `"hide"` → caller must remove the element from the DOM.
 * - Denied with `"disable"` → caller must render the element as non-interactive.
 *
 * This function does **not** execute or trigger any side effects.
 */
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

/**
 * Filters an action list to the subset visible in the given context.
 *
 * Actions with `denialEffect: "hide"` are excluded entirely.
 * Actions with `denialEffect: "disable"` are retained so renderers can
 * render them as non-interactive (the module layer enforces the guard).
 * Allowed actions are always retained.
 */
export const resolveMetadataActions = (
  actions: readonly MetadataActionContract[],
  context: MetadataVisibilityContext
): readonly MetadataActionContract[] =>
  actions.filter((action) => {
    const resolution = resolveMetadataVisibility(action.permission, context);
    return resolution.allowed || resolution.effect === "disable";
  });
