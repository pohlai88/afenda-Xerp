/**
 * Presentation policy contracts for metadata-ui render resolution.
 *
 * Authority:
 * - Defines governed visibility vocabulary for presentation resolvers.
 * - Consumes runtime modes from @afenda/ui-composition — does not redefine them.
 */

export const METADATA_VISIBILITY_STATES = [
  "visible",
  "hidden",
  "disabled",
  "readonly",
] as const;

export type MetadataVisibilityState =
  (typeof METADATA_VISIBILITY_STATES)[number];

export const METADATA_VISIBILITY_REASONS = {
  capabilityRequired: "Capability required.",
  featureFlagRequired: "Feature flag required.",
  forbidden: "Forbidden.",
  hidden: "Hidden.",
  maintenanceMode: "Maintenance mode.",
  permissionRequired: "Permission required.",
  readonlyMode: "Read-only mode.",
} as const;

export type MetadataVisibilityReason =
  (typeof METADATA_VISIBILITY_REASONS)[keyof typeof METADATA_VISIBILITY_REASONS];

export interface MetadataVisibilityInput {
  /**
   * Whether maintenance runtime state should disable this target.
   *
   * Defaults to true.
   */
  readonly disableWhenMaintenance?: boolean;

  /**
   * Whether readonly mode should disable this target.
   *
   * Defaults to true.
   */
  readonly disableWhenReadonly?: boolean;

  /**
   * Whether forbidden runtime state should hide this target.
   *
   * Defaults to true.
   */
  readonly hideWhenForbidden?: boolean;

  /**
   * Optional human-readable reason supplied by the caller.
   */
  readonly reason?: string;

  /**
   * Capability required to render/enable the target.
   */
  readonly requiredCapability?: string;

  /**
   * Feature flag required to render/enable the target.
   */
  readonly requiredFeatureFlag?: string;

  /**
   * Permission required to render/enable the target.
   */
  readonly requiredPermission?: string;
  /**
   * Requested visibility from the metadata contract.
   *
   * Defaults to "visible".
   */
  readonly visibility?: MetadataVisibilityState;
}

export interface MetadataVisibilityResult {
  readonly disabled: boolean;
  readonly reason?: string;
  readonly visibility: MetadataVisibilityState;
  readonly visible: boolean;
}

/**
 * @deprecated Use `MetadataVisibilityInput.visibility` during migration only.
 */
export interface LegacyMetadataVisibilityInput {
  readonly disabled?: boolean;
  readonly hidden?: boolean;
  readonly reason?: string;
  readonly requiredPermission?: string;
}
