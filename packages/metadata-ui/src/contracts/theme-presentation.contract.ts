/**
 * Theme preset vocabulary for metadata-ui render context (PAS-005A B42).
 *
 * Slugs must stay aligned with @afenda/shadcn-studio THEME_PRESET_SLUGS.
 * metadata-ui owns vocabulary only — not preset runtime or CSS application.
 */

export const METADATA_UI_THEME_PRESET_SLUGS = [
  "default",
  "caffeine",
  "claude",
  "corporate",
  "ghibli-studio",
  "marvel",
  "material-design",
  "modern-minimal",
  "nature",
  "perplexity",
  "slack",
  "pastel-dreams",
] as const;

export type MetadataUiThemePresetSlug =
  (typeof METADATA_UI_THEME_PRESET_SLUGS)[number];

const METADATA_UI_THEME_PRESET_SLUG_SET = new Set<string>(
  METADATA_UI_THEME_PRESET_SLUGS
);

export function isMetadataUiThemePresetSlug(
  value: string
): value is MetadataUiThemePresetSlug {
  return METADATA_UI_THEME_PRESET_SLUG_SET.has(value);
}

export interface MetadataUiThemePresentation {
  /**
   * Optional shadcn/studio theme preset selected for the render surface.
   *
   * Runtime application belongs to ERP/appshell — not metadata-ui.
   */
  readonly themePresetSlug?: MetadataUiThemePresetSlug;
}
