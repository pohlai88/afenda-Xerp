/**
 * Afenda Verdant Milk Noir token SSOT — review artifact for editorial lab palette.
 *
 * Standard shadcn CSS variable names (light + dark) plus resolved `--afenda-*`
 * editorial anchors mirrored from docs/verdant-noir.css.
 *
 * CSS mirror: packages/shadcn-studio/docs/verdant-noir.css
 * Spec (quarantine): packages/shadcn-studio/docs/verdant.noir.md
 *
 * Storybook / lab only — not registered in theme-presets.ts or ERP globals.
 */

export const AFENDA_VERDANT_PRESET_ID = "afenda-verdant" as const;

/** Chromatic anchors from Verdant Milk Noir lab (dark editorial default). */
export const afendaVerdantPaletteAnchors = {
  canvas: "oklch(0.105 0.018 150)",
  surface: "oklch(0.14 0.016 150)",
  surfaceRaised: "oklch(0.17 0.016 150)",
  ink: "oklch(0.93 0.01 95)",
  inkMuted: "oklch(0.62 0.01 95)",
  milk: "oklch(0.945 0.008 95)",
  green: "oklch(0.61 0.07 150)",
  greenSoft: "oklch(0.61 0.07 150 / 0.14)",
  gold: "oklch(0.72 0.045 82)",
  goldSoft: "oklch(0.72 0.045 82 / 0.18)",
  hairline: "oklch(0.78 0.025 82 / 0.18)",
} as const;

/** Resolved editorial `--afenda-*` anchors per mode (contracts depend on afenda-* names). */
export const afendaVerdantEditorialAnchors = {
  light: {
    canvas: "oklch(0.978 0.008 110)",
    surface: "oklch(0.988 0.006 110)",
    surfaceRaised: "oklch(0.998 0.003 110)",
    ink: "oklch(0.19 0.012 145)",
    inkMuted: "oklch(0.5 0.012 145)",
    milk: "oklch(0.985 0.005 98)",
    green: "oklch(0.43 0.055 155)",
    greenSoft: "oklch(0.84 0.03 145 / 0.55)",
    gold: "oklch(0.73 0.05 82)",
    goldSoft: "oklch(0.84 0.035 82 / 0.35)",
    hairline: "oklch(0.83 0.01 100 / 0.72)",
  },
  dark: afendaVerdantPaletteAnchors,
} as const;

/** Per-group lock status — design SSOT in review; not wired to ERP SettingsProvider. */
export const afendaVerdantTokenGroups = {
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
    status: "review" as const,
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
    status: "review" as const,
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
    status: "review" as const,
  },
  chart: {
    keys: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
    status: "review" as const,
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
    status: "review" as const,
  },
  editorial: {
    keys: [
      "afenda-canvas",
      "afenda-surface",
      "afenda-surface-raised",
      "afenda-ink",
      "afenda-ink-muted",
      "afenda-milk",
      "afenda-green",
      "afenda-green-soft",
      "afenda-gold",
      "afenda-gold-soft",
      "afenda-hairline",
    ],
    status: "review" as const,
  },
  radius: {
    keys: ["radius"],
    status: "review" as const,
  },
} as const;

export const afendaVerdantPreset = {
  id: AFENDA_VERDANT_PRESET_ID,
  label: "Afenda Verdant Milk Noir",
  description:
    "Editorial verdant palette: milk wash, deep green ink, gold hairlines. Standard shadcn token names plus --afenda-* editorial anchors — Storybook lab only.",
  className: "theme-afenda-verdant-milk-noir",
  status: "review" as const,
  tokenGroups: afendaVerdantTokenGroups,
  anchors: afendaVerdantPaletteAnchors,
  editorialAnchors: afendaVerdantEditorialAnchors,
  tokens: {
    light: {
      background: "oklch(0.978 0.008 110)",
      foreground: "oklch(0.19 0.012 145)",
      card: "oklch(0.988 0.006 110)",
      "card-foreground": "oklch(0.19 0.012 145)",
      popover: "oklch(0.992 0.005 110)",
      "popover-foreground": "oklch(0.19 0.012 145)",
      primary: "oklch(0.43 0.055 155)",
      "primary-foreground": "oklch(0.965 0.012 98)",
      secondary: "oklch(0.95 0.01 110)",
      "secondary-foreground": "oklch(0.24 0.012 145)",
      muted: "oklch(0.945 0.008 110)",
      "muted-foreground": "oklch(0.5 0.012 145)",
      accent: "oklch(0.935 0.018 150)",
      "accent-foreground": "oklch(0.24 0.02 145)",
      destructive: "oklch(0.57 0.19 27.3)",
      "destructive-foreground": "oklch(0.985 0.004 95)",
      border: "oklch(0.87 0.008 110)",
      input: "oklch(0.89 0.008 110)",
      ring: "oklch(0.52 0.04 70)",
      "chart-1": "oklch(0.72 0.08 150)",
      "chart-2": "oklch(0.63 0.06 165)",
      "chart-3": "oklch(0.56 0.05 180)",
      "chart-4": "oklch(0.72 0.07 82)",
      "chart-5": "oklch(0.48 0.03 120)",
      sidebar: "oklch(0.968 0.008 110)",
      "sidebar-foreground": "oklch(0.19 0.012 145)",
      "sidebar-primary": "oklch(0.43 0.055 155)",
      "sidebar-primary-foreground": "oklch(0.965 0.012 98)",
      "sidebar-accent": "oklch(0.935 0.018 150)",
      "sidebar-accent-foreground": "oklch(0.24 0.02 145)",
      "sidebar-border": "oklch(0.87 0.008 110)",
      "sidebar-ring": "oklch(0.52 0.04 70)",
      info: "hsl(165 55% 34%)",
      "info-foreground": "hsl(155 100% 97%)",
      success: "hsl(152 65% 32%)",
      "success-foreground": "hsl(145 81% 96%)",
      warning: "hsl(42 90% 42%)",
      "warning-foreground": "hsl(45 100% 96%)",
      "border-subtle": "hsl(110 8% 50% / 0.08)",
      radius: "0.875rem",
    },
    dark: {
      background: afendaVerdantPaletteAnchors.canvas,
      foreground: afendaVerdantPaletteAnchors.ink,
      card: afendaVerdantPaletteAnchors.surface,
      "card-foreground": afendaVerdantPaletteAnchors.ink,
      popover: "oklch(0.155 0.017 150)",
      "popover-foreground": afendaVerdantPaletteAnchors.ink,
      primary: afendaVerdantPaletteAnchors.green,
      "primary-foreground": afendaVerdantPaletteAnchors.canvas,
      secondary: "oklch(0.175 0.013 150)",
      "secondary-foreground": "oklch(0.86 0.01 95)",
      muted: "oklch(0.18 0.011 150)",
      "muted-foreground": afendaVerdantPaletteAnchors.inkMuted,
      accent: "oklch(0.205 0.023 152)",
      "accent-foreground": "oklch(0.9 0.012 95)",
      destructive: "oklch(0.62 0.16 28)",
      "destructive-foreground": "oklch(0.96 0.008 95)",
      border: afendaVerdantPaletteAnchors.hairline,
      input: "oklch(1 0 0 / 0.09)",
      ring: afendaVerdantPaletteAnchors.gold,
      "chart-1": "oklch(0.72 0.08 150)",
      "chart-2": "oklch(0.63 0.06 165)",
      "chart-3": "oklch(0.56 0.05 180)",
      "chart-4": "oklch(0.74 0.05 82)",
      "chart-5": "oklch(0.5 0.025 120)",
      sidebar: "oklch(0.13 0.014 150)",
      "sidebar-foreground": "oklch(0.9 0.01 95)",
      "sidebar-primary": "oklch(0.64 0.075 150)",
      "sidebar-primary-foreground": afendaVerdantPaletteAnchors.canvas,
      "sidebar-accent": "oklch(0.18 0.012 150)",
      "sidebar-accent-foreground": "oklch(0.9 0.01 95)",
      "sidebar-border": afendaVerdantPaletteAnchors.hairline,
      "sidebar-ring": afendaVerdantPaletteAnchors.gold,
      info: "hsl(165 50% 68%)",
      "info-foreground": "hsl(160 55% 12%)",
      success: "hsl(148 55% 62%)",
      "success-foreground": "hsl(156 79% 11%)",
      warning: "hsl(42 95% 62%)",
      "warning-foreground": "hsl(17 79% 17%)",
      "border-subtle": "hsl(0 0% 100% / 0.1)",
      radius: "0.875rem",
    },
  },
  usage: {
    bestFor: [
      "Presentation Lab verdant landing",
      "Storybook editorial atmosphere demos",
      "Verdant Milk Noir palette reference",
    ],
    avoidFor: [
      "ERP production globals until Theme Lab validation",
      "SettingsProvider html inline theme registration",
      "Renaming --afenda-* editorial aliases to --lab-*",
    ],
  },
} as const;

export type AfendaVerdantPreset = typeof afendaVerdantPreset;
