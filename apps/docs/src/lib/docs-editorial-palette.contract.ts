/**
 * Docs theme contract — Fumadocs solar preset + Afenda overrides.
 */

/** Canonical Fumadocs theme CSS import order in globals.css */
export const docsFumadocsThemeImports = [
  "fumadocs-ui/css/solar.css",
  "fumadocs-ui/css/preset.css",
] as const;

export const docsProseAccentCssVariables = {
  default: "--docs-prose-accent",
  hover: "--docs-prose-accent-hover",
} as const;

/** Pinned OKLCH literals — Afenda brand blue for prose links only. */
export const docsProseAccentValues = {
  light: {
    default: "oklch(0.46 0.08 254)",
    hover: "oklch(0.4 0.1 254)",
  },
  dark: {
    default: "oklch(0.62 0.035 254)",
    hover: "oklch(0.68 0.03 254)",
  },
} as const;

export const docsLayoutVariables = {
  layoutWidth: "--fd-layout-width",
  layoutWidthValue: "1400px",
  proseMaxWidth: "66ch",
} as const;

/** Artisan editorial type scale */
export const docsTypographyScale = {
  caption: { variable: "--docs-text-caption", value: "0.6875rem" },
  meta: { variable: "--docs-text-meta", value: "0.75rem" },
  ui: { variable: "--docs-text-ui", value: "0.8125rem" },
  body: { variable: "--docs-text-body", value: "0.875rem" },
  label: { variable: "--docs-text-label", value: "0.9375rem" },
  heading: { variable: "--docs-text-heading", value: "1.0625rem" },
  section: { variable: "--docs-text-section", value: "1.3125rem" },
  title: { variable: "--docs-text-title", value: "1.75rem" },
  display: { variable: "--docs-text-display", value: "2.5rem" },
} as const;

export const docsTypographyVariables = {
  base: "--docs-text-base",
  baseValue: "var(--docs-text-body)",
  display: "--docs-text-display",
  displayValue: "2.5rem",
  headline: "--docs-text-4xl",
  headlineValue: "var(--docs-text-display)",
  proseMaxWidth: "--docs-prose-max-width",
  leadingNormal: "--docs-leading-normal",
  leadingNormalValue: "1.65",
  leadingTitle: "--docs-leading-title",
  leadingTitleValue: "1.3",
} as const;

/** Editorial role utility classes in docs-editorial-typography.css */
export const docsTypographyRoleClasses = {
  display: "docs-type-display",
  summary: "docs-type-summary",
  deck: "docs-type-deck",
  overline: "docs-type-overline",
  ui: "docs-type-ui",
  caption: "docs-type-caption",
} as const;

export const docsTypographyStylesheet = "./docs-editorial-typography.css" as const;

export const docsSpacingStylesheet = "./docs-editorial-spacing.css" as const;

export const docsEditorialTokensStylesheet =
  "./docs-editorial-tokens.css" as const;

/** 4px-base spacing primitives + semantic roles */
export const docsSpacingScale = {
  space1: { variable: "--docs-space-1", value: "0.25rem" },
  space2: { variable: "--docs-space-2", value: "0.5rem" },
  space3: { variable: "--docs-space-3", value: "0.75rem" },
  space4: { variable: "--docs-space-4", value: "1rem" },
  space5: { variable: "--docs-space-5", value: "1.5rem" },
  space6: { variable: "--docs-space-6", value: "2rem" },
  space7: { variable: "--docs-space-7", value: "3rem" },
  space8: { variable: "--docs-space-8", value: "4rem" },
} as const;

export const docsSpacingRoles = {
  gapChrome: { variable: "--docs-gap-chrome", mapsTo: "--docs-space-4" },
  gapBlock: { variable: "--docs-gap-block", mapsTo: "--docs-space-5" },
  gapSection: { variable: "--docs-gap-section", mapsTo: "--docs-space-7" },
  gapInline: { variable: "--docs-gap-inline", mapsTo: "--docs-space-3" },
  insetComponent: { variable: "--docs-inset-component", mapsTo: "--docs-space-3" },
  insetComfort: { variable: "--docs-inset-comfort", mapsTo: "--docs-space-5" },
  divider: { variable: "--docs-divider" },
  calloutSurface: { variable: "--docs-callout-surface" },
  calloutAccent: { variable: "--docs-callout-accent" },
} as const;

export const docsSurfaceVariables = {
  noiseOpacity: "--docs-noise-opacity",
  illustrationOpacity: "--docs-illustration-opacity",
} as const;

/** Luxury shell palette — fd token overrides in docs-luxury-shell.css */
export const docsLuxuryShellStylesheet = "./docs-luxury-shell.css" as const;

export const docsEditorialPrimitiveNames = [
  "canvas",
  "paper",
  "text",
  "text-muted",
  "border",
  "border-subtle",
  "surface-muted",
  "surface-hover",
  "prose-accent",
  "callout-warn",
  "ring",
] as const;

/** Editorial MDX block token chain in docs-editorial-blocks.css (:where(.nd-page)). */
export const docsEditorialBlockVariables = {
  canvas: "--docs-editorial-block-canvas",
  canvasValue: "var(--docs-editorial-canvas)",
  accent: "--docs-editorial-block-accent",
  accentValue: "var(--docs-editorial-prose-accent)",
} as const;
