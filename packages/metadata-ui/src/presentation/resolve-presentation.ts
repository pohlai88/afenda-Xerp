import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import {
  METADATA_VISIBILITY_REASONS,
  type LegacyMetadataVisibilityInput,
  type MetadataVisibilityInput,
  type MetadataVisibilityResult,
  type MetadataVisibilityState,
} from "./presentation.contract.js";

export function resolvePresentationMode(
  context: MetadataUiRenderContext
): MetadataUiRenderContext["runtime"]["presentationMode"] {
  return context.runtime.presentationMode;
}

export function resolveDensityMode(
  context: MetadataUiRenderContext
): MetadataUiRenderContext["runtime"]["density"] {
  return context.runtime.density;
}

export function resolveReadonlyMode(context: MetadataUiRenderContext): boolean {
  return context.runtime.readonlyMode;
}

function hasRuntimeValue(
  values: readonly string[] | undefined,
  requiredValue: string | undefined
): boolean {
  if (requiredValue === undefined) {
    return true;
  }

  return values?.includes(requiredValue) ?? false;
}

function createVisibilityResult(
  visibility: MetadataVisibilityState,
  reason?: string
): MetadataVisibilityResult {
  return {
    visibility,
    visible: visibility !== "hidden",
    disabled: visibility === "disabled" || visibility === "readonly",
    ...(reason !== undefined ? { reason } : {}),
  };
}

function pickLegacyFields(
  input: LegacyMetadataVisibilityInput
): Pick<MetadataVisibilityInput, "reason" | "requiredPermission"> {
  return {
    ...(input.reason !== undefined ? { reason: input.reason } : {}),
    ...(input.requiredPermission !== undefined
      ? { requiredPermission: input.requiredPermission }
      : {}),
  };
}

export function normalizeLegacyVisibilityInput(
  input: LegacyMetadataVisibilityInput
): MetadataVisibilityInput {
  const legacyFields = pickLegacyFields(input);

  if (input.hidden === true) {
    return {
      visibility: "hidden",
      ...legacyFields,
    };
  }

  if (input.disabled === true) {
    return {
      visibility: "disabled",
      ...legacyFields,
    };
  }

  return {
    visibility: "visible",
    ...legacyFields,
  };
}

export function resolveVisibility(
  input: MetadataVisibilityInput,
  context: MetadataUiRenderContext
): MetadataVisibilityResult {
  const requestedVisibility = input.visibility ?? "visible";
  const disableWhenReadonly = input.disableWhenReadonly ?? true;
  const hideWhenForbidden = input.hideWhenForbidden ?? true;
  const disableWhenMaintenance = input.disableWhenMaintenance ?? true;

  if (requestedVisibility === "hidden") {
    return createVisibilityResult(
      "hidden",
      input.reason ?? METADATA_VISIBILITY_REASONS.hidden
    );
  }

  if (requestedVisibility === "disabled") {
    return createVisibilityResult("disabled", input.reason);
  }

  if (requestedVisibility === "readonly") {
    return createVisibilityResult(
      "readonly",
      input.reason ?? METADATA_VISIBILITY_REASONS.readonlyMode
    );
  }

  if (context.runtime.state === "forbidden" && hideWhenForbidden) {
    return createVisibilityResult(
      "hidden",
      input.reason ?? METADATA_VISIBILITY_REASONS.forbidden
    );
  }

  if (
    !hasRuntimeValue(context.runtime.permissions, input.requiredPermission)
  ) {
    return createVisibilityResult(
      "disabled",
      input.reason ?? METADATA_VISIBILITY_REASONS.permissionRequired
    );
  }

  if (
    !hasRuntimeValue(context.runtime.capabilities, input.requiredCapability)
  ) {
    return createVisibilityResult(
      "disabled",
      input.reason ?? METADATA_VISIBILITY_REASONS.capabilityRequired
    );
  }

  if (
    !hasRuntimeValue(context.runtime.featureFlags, input.requiredFeatureFlag)
  ) {
    return createVisibilityResult(
      "disabled",
      input.reason ?? METADATA_VISIBILITY_REASONS.featureFlagRequired
    );
  }

  if (context.runtime.readonlyMode && disableWhenReadonly) {
    return createVisibilityResult(
      "readonly",
      input.reason ?? METADATA_VISIBILITY_REASONS.readonlyMode
    );
  }

  if (context.runtime.state === "maintenance" && disableWhenMaintenance) {
    return createVisibilityResult(
      "disabled",
      input.reason ?? METADATA_VISIBILITY_REASONS.maintenanceMode
    );
  }

  return createVisibilityResult("visible");
}
