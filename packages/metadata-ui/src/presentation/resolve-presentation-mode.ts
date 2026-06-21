import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";

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

export interface MetadataVisibilityInput {
  readonly hidden?: boolean;
  readonly disabled?: boolean;
  readonly reason?: string;
  readonly requiredPermission?: string;
}

export interface MetadataVisibilityResult {
  readonly visible: boolean;
  readonly disabled: boolean;
  readonly reason: string | null;
}

export function resolveVisibility(
  input: MetadataVisibilityInput,
  context: MetadataUiRenderContext
): MetadataVisibilityResult {
  const granted = new Set(context.runtime.permissions ?? []);

  if (input.hidden) {
    return { visible: false, disabled: false, reason: input.reason ?? null };
  }

  if (
    input.requiredPermission &&
    !granted.has(input.requiredPermission)
  ) {
    return {
      visible: true,
      disabled: true,
      reason: input.reason ?? "Permission required.",
    };
  }

  if (input.disabled || context.runtime.readonlyMode) {
    return {
      visible: true,
      disabled: true,
      reason: input.reason ?? (context.runtime.readonlyMode ? "Read-only mode." : null),
    };
  }

  if (context.runtime.state === "forbidden") {
    return { visible: false, disabled: false, reason: "Forbidden." };
  }

  if (context.runtime.state === "maintenance") {
    return {
      visible: true,
      disabled: true,
      reason: "Maintenance mode.",
    };
  }

  return { visible: true, disabled: false, reason: null };
}
