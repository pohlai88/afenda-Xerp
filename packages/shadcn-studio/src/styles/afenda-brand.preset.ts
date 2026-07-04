/**
 * Afenda brand token SSOT — review artifact for expanded Swiss Noir palette.
 *
 * Uses standard shadcn CSS variable names only (no --lab-* / --afenda-* aliases).
 * Editorial `--lab-*` aliases stay derived inside the scoped CSS mirror rather
 * than joining the runtime preset contract.
 * Values are derived from Presentation Lab Swiss Noir anchors; numbers marked
 * `review` should be validated on dense surfaces before ERP promotion.
 *
 * CSS mirror: packages/shadcn-studio/docs/swiss-noir.css
 * Scoped editorial overlay only — not registered in theme-presets.ts, not a
 * replacement for shadcn-studio.css root defaults, and not wired into ERP globals.
 */

export const AFENDA_BRAND_PRESET_ID = "afenda-brand" as const;

/** Chromatic anchors from Swiss Noir lab (hue families). */
export const afendaBrandPaletteAnchors = {
  ink: "oklch(0.108 0.006 260)",
  paper: "oklch(0.91 0.012 82)",
  gold: "oklch(0.74 0.08 78)",
  blueprint: "oklch(0.58 0.07 250)",
  elevated: "oklch(0.145 0.008 260)",
  mutedField: "oklch(0.19 0.008 260)",
  line: "oklch(0.31 0.008 260 / 0.62)",
} as const;

/** Per-group lock status — design SSOT approved; ERP `.dark` replacement still gated. */
export const afendaBrandTokenGroups = {
  surface: {
    keys: [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "muted",
      "muted-foreground",
      "border",
      "input",
      "border-subtle",
    ],
    status: "locked" as const,
  },
  action: {
    keys: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
      "ring",
    ],
    status: "locked" as const,
  },
  sidebar: {
    keys: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
    status: "locked" as const,
  },
  chart: {
    keys: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
    status: "locked" as const,
  },
  semantic: {
    keys: [
      "info",
      "info-foreground",
      "success",
      "success-foreground",
      "warning",
      "warning-foreground",
    ],
    status: "locked" as const,
  },
  radius: {
    keys: ["radius"],
    status: "locked" as const,
  },
} as const;

export const afendaBrandPreset = {
  id: AFENDA_BRAND_PRESET_ID,
  label: "Afenda Brand (Swiss Noir DNA)",
  description:
    "Expanded Swiss Noir palette for Afenda brand surfaces: blue-black ink, warm paper, amber gold accent, blueprint whisper. Scoped overlay with standard shadcn token names only.",
  className: "theme-afenda-brand",
  status: "review" as const,
  figmaFileKey: "LsmtG4KiaTUi3KpjxZXHwH",
  figmaFileUrl:
    "https://www.figma.com/design/LsmtG4KiaTUi3KpjxZXHwH/Afenda-Brand-Tokens-AdminCN",
  tokenGroups: afendaBrandTokenGroups,
  anchors: afendaBrandPaletteAnchors,
  tokens: {
    light: {
      background: "oklch(0.978 0.006 260)",
      foreground: "oklch(0.22 0.012 260)",
      card: "oklch(0.992 0.004 260)",
      "card-foreground": "oklch(0.22 0.012 260)",
      popover: "oklch(0.995 0.003 260)",
      "popover-foreground": "oklch(0.22 0.012 260)",
      primary: "oklch(0.52 0.09 78)",
      "primary-foreground": "oklch(0.98 0.008 82)",
      secondary: "oklch(0.94 0.008 260)",
      "secondary-foreground": "oklch(0.32 0.012 260)",
      muted: "oklch(0.955 0.006 260)",
      "muted-foreground": "oklch(0.48 0.012 260)",
      accent: "oklch(0.92 0.02 250)",
      "accent-foreground": "oklch(0.28 0.04 250)",
      destructive: "oklch(0.57 0.19 27.3)",
      "destructive-foreground": "oklch(0.985 0.004 95)",
      border: "oklch(0.87 0.008 260)",
      input: "oklch(0.89 0.008 260)",
      ring: "oklch(0.52 0.09 78)",
      "chart-1": "oklch(0.52 0.09 78)",
      "chart-2": "oklch(0.58 0.07 250)",
      "chart-3": "oklch(0.42 0.04 260)",
      "chart-4": "oklch(0.68 0.06 82)",
      "chart-5": "oklch(0.36 0.03 260)",
      sidebar: "oklch(0.968 0.006 260)",
      "sidebar-foreground": "oklch(0.22 0.012 260)",
      "sidebar-primary": "oklch(0.52 0.09 78)",
      "sidebar-primary-foreground": "oklch(0.98 0.008 82)",
      "sidebar-accent": "oklch(0.94 0.012 250)",
      "sidebar-accent-foreground": "oklch(0.28 0.04 250)",
      "sidebar-border": "oklch(0.87 0.008 260)",
      "sidebar-ring": "oklch(0.52 0.09 78)",
      info: "hsl(210, 85%, 38%)",
      "info-foreground": "hsl(210, 100%, 97%)",
      success: "hsl(152, 65%, 32%)",
      "success-foreground": "hsl(145, 81%, 96%)",
      warning: "hsl(32, 90%, 40%)",
      "warning-foreground": "hsl(45, 100%, 96%)",
      "border-subtle": "hsl(260, 8%, 50%, 0.08)",
      radius: "0.875rem",
    },
    dark: {
      background: afendaBrandPaletteAnchors.ink,
      foreground: afendaBrandPaletteAnchors.paper,
      card: afendaBrandPaletteAnchors.elevated,
      "card-foreground": afendaBrandPaletteAnchors.paper,
      popover: "oklch(0.155 0.008 260)",
      "popover-foreground": afendaBrandPaletteAnchors.paper,
      primary: afendaBrandPaletteAnchors.gold,
      "primary-foreground": afendaBrandPaletteAnchors.ink,
      secondary: "oklch(0.175 0.008 260)",
      "secondary-foreground": "oklch(0.86 0.012 82)",
      muted: afendaBrandPaletteAnchors.mutedField,
      "muted-foreground": "oklch(0.64 0.012 82)",
      accent: afendaBrandPaletteAnchors.blueprint,
      "accent-foreground": afendaBrandPaletteAnchors.paper,
      destructive: "oklch(0.58 0.12 28)",
      "destructive-foreground": "oklch(0.96 0.008 95)",
      border: afendaBrandPaletteAnchors.line,
      input: "oklch(1 0 0 / 0.09)",
      ring: afendaBrandPaletteAnchors.gold,
      "chart-1": afendaBrandPaletteAnchors.gold,
      "chart-2": afendaBrandPaletteAnchors.blueprint,
      "chart-3": "oklch(0.43 0.04 260)",
      "chart-4": "oklch(0.78 0.04 82)",
      "chart-5": "oklch(0.29 0.02 260)",
      sidebar: "oklch(0.13 0.007 260)",
      "sidebar-foreground": "oklch(0.9 0.01 82)",
      "sidebar-primary": afendaBrandPaletteAnchors.gold,
      "sidebar-primary-foreground": afendaBrandPaletteAnchors.ink,
      "sidebar-accent": "oklch(0.18 0.01 260)",
      "sidebar-accent-foreground": "oklch(0.9 0.01 82)",
      "sidebar-border": afendaBrandPaletteAnchors.line,
      "sidebar-ring": afendaBrandPaletteAnchors.gold,
      info: "hsl(210, 75%, 72%)",
      "info-foreground": "hsl(210, 55%, 14%)",
      success: "hsl(148, 55%, 62%)",
      "success-foreground": "hsl(156, 79%, 11%)",
      warning: "hsl(42, 95%, 62%)",
      "warning-foreground": "hsl(17, 79%, 17%)",
      "border-subtle": "hsl(0, 0%, 100%, 0.1)",
      radius: "0.875rem",
    },
  },
  usage: {
    bestFor: [
      "Marketing hero surfaces",
      "Editorial landing sections",
      "Storybook brand preview",
      "Presentation Lab palette reference",
    ],
    avoidFor: [
      "Dense ERP tables and forms until Theme Lab validation",
      "Replacing stock AdminCN `.dark` wholesale without review",
      "Parallel custom token aliases in primitives",
    ],
  },
} as const;

export type AfendaBrandPreset = typeof afendaBrandPreset;
