/**
 * Governed metadata vocabulary constants.
 *
 * Source of truth for all metadata authority union types.
 *
 * Rules:
 * - Do not add values without TIP-005 authority approval.
 * - Do not duplicate these arrays in downstream packages.
 * - Do not redefine these values in @afenda/metadata-ui.
 * - Any change requires contract version bump and governance tests.
 */

function createReadonlySet<const T extends readonly string[]>(
  values: T
): ReadonlySet<T[number]> {
  return new Set(values);
}

/** Governed surface vocabulary — source of truth for `SurfaceType`. */
export const SURFACE_TYPES = ["page", "workspace", "module"] as const;

export type SurfaceType = (typeof SURFACE_TYPES)[number];

export const SURFACE_TYPE_SET = createReadonlySet(SURFACE_TYPES);

export function isSurfaceType(value: string): value is SurfaceType {
  return SURFACE_TYPE_SET.has(value as SurfaceType);
}

/** Governed layout vocabulary — source of truth for `LayoutType`. */
export const LAYOUT_TYPES = [
  "dashboard",
  "grid",
  "panel",
  "stack",
  "tabs",
  "wizard",
] as const;

export type LayoutType = (typeof LAYOUT_TYPES)[number];

export const LAYOUT_TYPE_SET = createReadonlySet(LAYOUT_TYPES);

export function isLayoutType(value: string): value is LayoutType {
  return LAYOUT_TYPE_SET.has(value as LayoutType);
}

/** Governed section vocabulary — source of truth for `SectionType`. */
export const SECTION_TYPES = [
  "list",
  "stat",
  "chart",
  "form",
  "detail",
  "audit",
  "action",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_TYPE_SET = createReadonlySet(SECTION_TYPES);

export function isSectionType(value: string): value is SectionType {
  return SECTION_TYPE_SET.has(value as SectionType);
}

/** Governed presentation modes — source of truth for `PresentationMode`. */
export const PRESENTATION_MODES = [
  "default",
  "compact",
  "comfortable",
  "readonly",
  "diagnostic",
] as const;

export type PresentationMode = (typeof PRESENTATION_MODES)[number];

export const PRESENTATION_MODE_SET = createReadonlySet(PRESENTATION_MODES);

export function isPresentationMode(value: string): value is PresentationMode {
  return PRESENTATION_MODE_SET.has(value as PresentationMode);
}

/** Governed density modes — source of truth for `MetadataDensityMode`. */
export const METADATA_DENSITY_MODES = [
  "compact",
  "default",
  "comfortable",
] as const;

export type MetadataDensityMode = (typeof METADATA_DENSITY_MODES)[number];

export const METADATA_DENSITY_MODE_SET = createReadonlySet(
  METADATA_DENSITY_MODES
);

export function isMetadataDensityMode(
  value: string
): value is MetadataDensityMode {
  return METADATA_DENSITY_MODE_SET.has(value as MetadataDensityMode);
}

/** Governed metadata lifecycles — source of truth for `MetadataLifecycle`. */
export const METADATA_LIFECYCLES = [
  "draft",
  "active",
  "deprecated",
  "removed",
] as const;

export type MetadataLifecycle = (typeof METADATA_LIFECYCLES)[number];

export const METADATA_LIFECYCLE_SET = createReadonlySet(METADATA_LIFECYCLES);

export function isMetadataLifecycle(value: string): value is MetadataLifecycle {
  return METADATA_LIFECYCLE_SET.has(value as MetadataLifecycle);
}

/** Governed runtime states — source of truth for `MetadataRuntimeState`. */
export const METADATA_RUNTIME_STATES = [
  "loading",
  "empty",
  "error",
  "forbidden",
  "ready",
  "invalid",
  "degraded",
  "partial",
  "readonly",
  "maintenance",
] as const;

export type MetadataRuntimeState = (typeof METADATA_RUNTIME_STATES)[number];

export const METADATA_RUNTIME_STATE_SET = createReadonlySet(
  METADATA_RUNTIME_STATES
);

export function isMetadataRuntimeState(
  value: string
): value is MetadataRuntimeState {
  return METADATA_RUNTIME_STATE_SET.has(value as MetadataRuntimeState);
}

/**
 * Governed renderer capabilities — source of truth for `RendererCapability`.
 *
 * Use kebab-case governance keys instead of implementation-style camelCase.
 * Renderer implementation may map these keys internally, but must not redefine them.
 */
export const RENDERER_CAPABILITIES = [
  "render-list",
  "render-stat",
  "render-chart",
  "render-form",
  "render-detail",
  "render-audit",
  "render-action",
] as const;

export type RendererCapability = (typeof RENDERER_CAPABILITIES)[number];

export const RENDERER_CAPABILITY_SET = createReadonlySet(RENDERER_CAPABILITIES);

export function isRendererCapability(
  value: string
): value is RendererCapability {
  return RENDERER_CAPABILITY_SET.has(value as RendererCapability);
}

/** Governed metadata authority keys — source of truth for `MetadataAuthorityKey`. */
export const METADATA_AUTHORITY_KEYS = [
  "metadata",
  "surface",
  "layout",
  "section",
  "renderer",
  "registry",
  "presentation",
  "runtime",
  "action",
] as const;

export type MetadataAuthorityKey = (typeof METADATA_AUTHORITY_KEYS)[number];

export const METADATA_AUTHORITY_KEY_SET = createReadonlySet(
  METADATA_AUTHORITY_KEYS
);

export function isMetadataAuthorityKey(
  value: string
): value is MetadataAuthorityKey {
  return METADATA_AUTHORITY_KEY_SET.has(value as MetadataAuthorityKey);
}
