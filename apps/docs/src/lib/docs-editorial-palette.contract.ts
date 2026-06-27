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

/** UI-first scale — content must not exceed shell chrome (4 sizes). */
export const docsTypographyScale = {
  meta: { variable: "--docs-text-meta", value: "0.75rem" },
  ui: { variable: "--docs-text-ui", value: "0.8125rem" },
  section: { variable: "--docs-text-section", value: "0.875rem" },
  title: { variable: "--docs-text-title", value: "1rem" },
} as const;

export const docsTypographyVariables = {
  base: "--docs-text-base",
  baseValue: "var(--docs-text-ui)",
  display: "--docs-text-display",
  displayValue: "var(--docs-text-title)",
  headline: "--docs-text-4xl",
  headlineValue: "var(--docs-text-title)",
  proseMaxWidth: "--docs-prose-max-width",
  leadingNormal: "--docs-leading-normal",
  leadingNormalValue: "1.65",
  leadingTitle: "--docs-leading-title",
  leadingTitleValue: "1.35",
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

/** 8px-base spacing primitives + semantic roles for quiet enterprise UI */
export const docsSpacingScale = {
  space1: { variable: "--docs-space-1", value: "0.25rem" },
  space2: { variable: "--docs-space-2", value: "0.5rem" },
  space3: { variable: "--docs-space-3", value: "0.75rem" },
  space4: { variable: "--docs-space-4", value: "1.25rem" },
  space5: { variable: "--docs-space-5", value: "2rem" },
  space6: { variable: "--docs-space-6", value: "2.5rem" },
  space7: { variable: "--docs-space-7", value: "3rem" },
} as const;

export const docsSpacingRoles = {
  gapChrome: { variable: "--docs-gap-chrome", mapsTo: "--docs-space-4" },
  gapBlock: { variable: "--docs-gap-block", mapsTo: "--docs-space-5" },
  gapSection: { variable: "--docs-gap-section", mapsTo: "--docs-space-6" },
  gapInline: { variable: "--docs-gap-inline", mapsTo: "--docs-space-3" },
  insetComponent: { variable: "--docs-inset-component", mapsTo: "--docs-space-5" },
  insetComfort: { variable: "--docs-inset-comfort", mapsTo: "--docs-space-6" },
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

/** @deprecated Editorial block CSS still uses --docs-editorial-block-* aliases mapped to fd tokens. */
export const docsEditorialPrimitiveNames = ["prose-accent", "prose-accent-hover"] as const;
