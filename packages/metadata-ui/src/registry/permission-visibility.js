"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMetadataActions = exports.resolveMetadataVisibility = void 0;
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
var resolveMetadataVisibility = function (requirement, context) {
    if (!requirement) {
        return {
            allowed: true,
            effect: null,
            reason: null,
        };
    }
    var grantedPermissions = new Set(context.grantedPermissions);
    var allowed = grantedPermissions.has(requirement.permissionKey);
    return {
        allowed: allowed,
        effect: allowed ? null : requirement.denialEffect,
        reason: allowed ? null : requirement.reason,
    };
};
exports.resolveMetadataVisibility = resolveMetadataVisibility;
/**
 * Filters an action list to the subset visible in the given context.
 *
 * Actions with `denialEffect: "hide"` are excluded entirely.
 * Actions with `denialEffect: "disable"` are retained so renderers can
 * render them as non-interactive (the module layer enforces the guard).
 * Allowed actions are always retained.
 */
var resolveMetadataActions = function (actions, context) {
    return actions.filter(function (action) {
        var resolution = (0, exports.resolveMetadataVisibility)(action.permission, context);
        return resolution.allowed || resolution.effect === "disable";
    });
};
exports.resolveMetadataActions = resolveMetadataActions;
