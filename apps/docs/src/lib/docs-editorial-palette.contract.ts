/**
 * Docs editorial palette contract — mirrors `docs-editorial-palette.css`.
 * Porcelain editorial material model: canvas / rail / paper layering.
 *
 * TWO-LAYER MODEL:
 *   Layer 1 — OKLCH literal primitives (listed in docsEditorialPrimitiveNames)
 *   Layer 2 — @theme inline bridge (docsShellFdBridge) → --color-fd-* tokens
 *
 * Computed/alias tokens (search, callout colours) are NOT in primitiveNames;
 * they reference other primitives and live in docsEditorialCssVariables only.
 */

/** Every `--docs-editorial-*` OKLCH literal in CSS must map here. */
export const docsEditorialPrimitiveNames = [
  "canvas",
  "rail",
  "paper",
  "text",
  "text-muted",
  "text-subtle",
  "surface-muted",
  "surface-raised",
  "surface-hover",
  "surface-active",
  "border",
  "border-subtle",
  "ring",
  "overlay",
  "prose-accent",
  "prose-accent-hover",
  "code-surface",
  "callout-info",
  "callout-warn",
] as const;

export type DocsEditorialPrimitiveName =
  (typeof docsEditorialPrimitiveNames)[number];

export const docsEditorialCssVariables = {
  canvas: "--docs-editorial-canvas",
  rail: "--docs-editorial-rail",
  paper: "--docs-editorial-paper",
  text: "--docs-editorial-text",
  textMuted: "--docs-editorial-text-muted",
  textSubtle: "--docs-editorial-text-subtle",
  surfaceMuted: "--docs-editorial-surface-muted",
  surfaceRaised: "--docs-editorial-surface-raised",
  surfaceHover: "--docs-editorial-surface-hover",
  surfaceActive: "--docs-editorial-surface-active",
  border: "--docs-editorial-border",
  borderSubtle: "--docs-editorial-border-subtle",
  ring: "--docs-editorial-ring",
  overlay: "--docs-editorial-overlay",
  proseAccent: "--docs-editorial-prose-accent",
  proseAccentHover: "--docs-editorial-prose-accent-hover",
  codeSurface: "--docs-editorial-code-surface",
  calloutInfo: "--docs-editorial-callout-info",
  calloutWarn: "--docs-editorial-callout-warn",
  /** Computed aliases — reference other primitives, not OKLCH literals */
  searchSurface: "--docs-editorial-search-surface",
  searchKbdSurface: "--docs-editorial-search-kbd-surface",
  searchKbdForeground: "--docs-editorial-search-kbd-foreground",
} as const;

/** Pinned OKLCH literals — porcelain light / graphite dark editorial baseline. */
export const docsEditorialPrimitiveValues = {
  light: {
    canvas: "oklch(0.985 0.003 95)",
    rail: "oklch(0.972 0.004 95)",
    paper: "oklch(0.998 0.001 95)",
    text: "oklch(0.18 0.006 260)",
    textMuted: "oklch(0.46 0.01 260)",
    textSubtle: "oklch(0.58 0.008 260)",
    surfaceMuted: "oklch(0.955 0.004 95)",
    surfaceRaised: "oklch(1 0 0)",
    surfaceHover: "oklch(0.935 0.005 95)",
    surfaceActive: "oklch(0.925 0.006 95)",
    border: "oklch(0.88 0.006 95)",
    borderSubtle: "oklch(0.92 0.004 95)",
    ring: "oklch(0.52 0.06 255)",
    overlay: "oklch(0.16 0.006 260 / 0.42)",
    codeSurface: "oklch(0.955 0.004 95)",
    calloutInfo: "oklch(0.48 0.17 254)",
    calloutWarn: "oklch(0.72 0.14 70)",
  },
  dark: {
    canvas: "oklch(0.155 0.004 260)",
    rail: "oklch(0.135 0.004 260)",
    paper: "oklch(0.18 0.004 260)",
    text: "oklch(0.93 0.004 95)",
    textMuted: "oklch(0.68 0.006 260)",
    textSubtle: "oklch(0.56 0.006 260)",
    surfaceMuted: "oklch(0.205 0.005 260)",
    surfaceRaised: "oklch(0.19 0.004 260)",
    surfaceHover: "oklch(0.235 0.006 260)",
    surfaceActive: "oklch(0.255 0.007 260)",
    border: "oklch(0.31 0.006 260)",
    borderSubtle: "oklch(0.25 0.005 260)",
    ring: "oklch(0.72 0.055 255)",
    overlay: "oklch(0.05 0.004 260 / 0.68)",
    codeSurface: "oklch(0.205 0.005 260)",
    calloutInfo: "oklch(0.72 0.14 254)",
    calloutWarn: "oklch(0.78 0.13 68)",
  },
} as const;

export const docsProseAccentValues = {
  light: {
    default: "oklch(0.48 0.17 254)",
    hover: "oklch(0.42 0.19 254)",
  },
  dark: {
    default: "oklch(0.72 0.14 254)",
    hover: "oklch(0.8 0.13 254)",
  },
} as const;

/**
 * Fumadocs `--color-fd-*` bridge — must use `@theme inline` in palette CSS.
 * fd-primary = heaviest neutral text — NOT brand accent.
 * fd-accent  = neutral hover surface — NOT brand accent.
 * fd-info    = callout info color (maps to docs-editorial-callout-info).
 * fd-warning = callout warn color (maps to docs-editorial-callout-warn).
 */
export const docsShellFdBridge = {
  "--color-fd-background": docsEditorialCssVariables.canvas,
  "--color-fd-foreground": docsEditorialCssVariables.text,
  "--color-fd-muted": docsEditorialCssVariables.surfaceMuted,
  "--color-fd-muted-foreground": docsEditorialCssVariables.textMuted,
  "--color-fd-popover": docsEditorialCssVariables.paper,
  "--color-fd-popover-foreground": docsEditorialCssVariables.text,
  "--color-fd-card": docsEditorialCssVariables.paper,
  "--color-fd-card-foreground": docsEditorialCssVariables.text,
  "--color-fd-border": docsEditorialCssVariables.border,
  "--color-fd-primary": docsEditorialCssVariables.text,
  "--color-fd-primary-foreground": docsEditorialCssVariables.canvas,
  "--color-fd-secondary": docsEditorialCssVariables.surfaceMuted,
  "--color-fd-secondary-foreground": docsEditorialCssVariables.text,
  "--color-fd-accent": docsEditorialCssVariables.surfaceHover,
  "--color-fd-accent-foreground": docsEditorialCssVariables.text,
  "--color-fd-ring": docsEditorialCssVariables.ring,
  "--color-fd-overlay": docsEditorialCssVariables.overlay,
  "--color-fd-info": docsEditorialCssVariables.calloutInfo,
  "--color-fd-warning": docsEditorialCssVariables.calloutWarn,
} as const;

/** Stable fumadocs shell selectors — safe across minor upgrades. */
export const docsShellChromeSelectors = {
  searchFull: "button[data-search-full]",
  searchKbd: "button[data-search-full] kbd",
  sidebarRoot: "#nd-sidebar",
  sidebarActive: '#nd-sidebar [data-active="true"]',
  tocRoot: "#nd-toc",
  tocLink: "#nd-toc a",
  mobileNav: "#nd-subnav",
} as const;

export const docsLayoutVariables = {
  layoutWidth: "--fd-layout-width",
  layoutWidthValue: "1400px",
  proseMaxWidth: "66ch",
} as const;
