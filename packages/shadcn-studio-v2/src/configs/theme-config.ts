import type {
  StudioThemeConfig,
  StudioThemeOption,
  StudioThemeTokenMap,
} from "../types/theme";
import { admincnThemePresets } from "./admincn-theme-presets";
import { editorialThemePresets } from "./editorial-theme-presets";

export const CANONICAL_THEME_TOKEN_NAMES = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const;

function mergeThemeTokens(
  baseTokens: StudioThemeTokenMap,
  overrides: Readonly<Record<string, string>>
): StudioThemeTokenMap {
  const mergedTokens = { ...baseTokens };

  for (const tokenName of CANONICAL_THEME_TOKEN_NAMES) {
    const overrideValue = overrides[tokenName];

    if (overrideValue !== undefined) {
      mergedTokens[tokenName] = overrideValue;
    }
  }

  return mergedTokens;
}

const shadcnDefaultTheme: StudioThemeOption = {
  id: "shadcn-default",
  kind: "default",
  label: "shadcn Default",
  description: "Canonical V2 default token layer.",
  tokens: {
    light: {
      background: "oklch(1 0 0)",
      foreground: "oklch(0.145 0 0)",
      card: "oklch(1 0 0)",
      "card-foreground": "oklch(0.145 0 0)",
      popover: "oklch(1 0 0)",
      "popover-foreground": "oklch(0.145 0 0)",
      primary: "oklch(0.205 0 0)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.97 0 0)",
      "secondary-foreground": "oklch(0.205 0 0)",
      muted: "oklch(0.97 0 0)",
      "muted-foreground": "oklch(0.48 0 0)",
      accent: "oklch(0.97 0 0)",
      "accent-foreground": "oklch(0.205 0 0)",
      destructive: "oklch(0.5 0.22 27)",
      "destructive-foreground": "oklch(0.985 0 0)",
      border: "oklch(0.922 0 0)",
      input: "oklch(0.922 0 0)",
      ring: "oklch(0.708 0 0)",
      "chart-1": "oklch(0.646 0.222 41.116)",
      "chart-2": "oklch(0.6 0.118 184.704)",
      "chart-3": "oklch(0.398 0.07 227.392)",
      "chart-4": "oklch(0.828 0.189 84.429)",
      "chart-5": "oklch(0.769 0.188 70.08)",
      sidebar: "oklch(0.985 0 0)",
      "sidebar-foreground": "oklch(0.145 0 0)",
      "sidebar-primary": "oklch(0.205 0 0)",
      "sidebar-primary-foreground": "oklch(0.985 0 0)",
      "sidebar-accent": "oklch(0.97 0 0)",
      "sidebar-accent-foreground": "oklch(0.205 0 0)",
      "sidebar-border": "oklch(0.922 0 0)",
      "sidebar-ring": "oklch(0.708 0 0)",
    },
    dark: {
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      card: "oklch(0.205 0 0)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0 0)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.922 0 0)",
      "primary-foreground": "oklch(0.205 0 0)",
      secondary: "oklch(0.269 0 0)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0 0)",
      "muted-foreground": "oklch(0.86 0 0)",
      accent: "oklch(0.269 0 0)",
      "accent-foreground": "oklch(0.985 0 0)",
      destructive: "oklch(0.5 0.18 24)",
      "destructive-foreground": "oklch(0.985 0 0)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.556 0 0)",
      "chart-1": "oklch(0.488 0.243 264.376)",
      "chart-2": "oklch(0.696 0.17 162.48)",
      "chart-3": "oklch(0.769 0.188 70.08)",
      "chart-4": "oklch(0.627 0.265 303.9)",
      "chart-5": "oklch(0.645 0.246 16.439)",
      sidebar: "oklch(0.205 0 0)",
      "sidebar-foreground": "oklch(0.985 0 0)",
      "sidebar-primary": "oklch(0.488 0.243 264.376)",
      "sidebar-primary-foreground": "oklch(0.985 0 0)",
      "sidebar-accent": "oklch(0.269 0 0)",
      "sidebar-accent-foreground": "oklch(0.985 0 0)",
      "sidebar-border": "oklch(1 0 0 / 10%)",
      "sidebar-ring": "oklch(0.556 0 0)",
    },
  },
};

const afendaBrandTheme: StudioThemeOption = {
  id: "afenda-brand",
  kind: "brand",
  label: "Afenda Operator",
  description:
    "Calm operator brand — cool neutrals, muted teal primary, long-session contrast.",
  tokens: {
    light: {
      background: "oklch(0.985 0.003 250)",
      foreground: "oklch(0.26 0.007 250)",
      card: "oklch(0.995 0.002 250)",
      "card-foreground": "oklch(0.26 0.007 250)",
      popover: "oklch(0.995 0.002 250)",
      "popover-foreground": "oklch(0.26 0.007 250)",
      primary: "oklch(0.45 0.09 200)",
      "primary-foreground": "oklch(0.98 0.005 200)",
      secondary: "oklch(0.94 0.006 250)",
      "secondary-foreground": "oklch(0.3 0.008 250)",
      muted: "oklch(0.955 0.004 250)",
      "muted-foreground": "oklch(0.46 0.008 250)",
      accent: "oklch(0.94 0.02 200)",
      "accent-foreground": "oklch(0.3 0.03 200)",
      destructive: "oklch(0.5 0.13 25)",
      "destructive-foreground": "oklch(0.98 0.005 25)",
      border: "oklch(0.9 0.004 250)",
      input: "oklch(0.88 0.004 250)",
      ring: "oklch(0.45 0.09 200)",
      "chart-1": "oklch(0.45 0.09 200)",
      "chart-2": "oklch(0.6 0.08 250)",
      "chart-3": "oklch(0.7 0.06 150)",
      "chart-4": "oklch(0.75 0.09 80)",
      "chart-5": "oklch(0.55 0.1 25)",
      sidebar: "oklch(0.965 0.004 250)",
      "sidebar-foreground": "oklch(0.26 0.007 250)",
      "sidebar-primary": "oklch(0.45 0.09 200)",
      "sidebar-primary-foreground": "oklch(0.98 0.005 200)",
      "sidebar-accent": "oklch(0.94 0.02 200)",
      "sidebar-accent-foreground": "oklch(0.3 0.03 200)",
      "sidebar-border": "oklch(0.9 0.004 250)",
      "sidebar-ring": "oklch(0.45 0.09 200)",
    },
    dark: {
      background: "oklch(0.19 0.006 250)",
      foreground: "oklch(0.92 0.004 250)",
      card: "oklch(0.22 0.007 250)",
      "card-foreground": "oklch(0.92 0.004 250)",
      popover: "oklch(0.22 0.007 250)",
      "popover-foreground": "oklch(0.92 0.004 250)",
      primary: "oklch(0.84 0.1 200)",
      "primary-foreground": "oklch(0.12 0.02 200)",
      secondary: "oklch(0.27 0.008 250)",
      "secondary-foreground": "oklch(0.9 0.005 250)",
      muted: "oklch(0.24 0.007 250)",
      "muted-foreground": "oklch(0.86 0.01 250)",
      accent: "oklch(0.3 0.03 200)",
      "accent-foreground": "oklch(0.9 0.02 200)",
      destructive: "oklch(0.5 0.15 25)",
      "destructive-foreground": "oklch(0.98 0.005 25)",
      border: "oklch(1 0 0 / 0.08)",
      input: "oklch(1 0 0 / 0.12)",
      ring: "oklch(0.84 0.1 200)",
      "chart-1": "oklch(0.84 0.1 200)",
      "chart-2": "oklch(0.7 0.03 250)",
      "chart-3": "oklch(0.75 0.06 150)",
      "chart-4": "oklch(0.78 0.09 80)",
      "chart-5": "oklch(0.68 0.12 25)",
      sidebar: "oklch(0.17 0.006 250)",
      "sidebar-foreground": "oklch(0.92 0.004 250)",
      "sidebar-primary": "oklch(0.88 0.1 200)",
      "sidebar-primary-foreground": "oklch(0.11 0.02 200)",
      "sidebar-accent": "oklch(0.3 0.03 200)",
      "sidebar-accent-foreground": "oklch(0.9 0.02 200)",
      "sidebar-border": "oklch(1 0 0 / 0.08)",
      "sidebar-ring": "oklch(0.88 0.1 200)",
    },
  },
};

const admincnThemeOptions: StudioThemeOption[] = Object.entries(
  admincnThemePresets
).map(([themeId, preset]) => ({
  id: themeId as StudioThemeOption["id"],
  kind: "reference" as const,
  label: preset.label,
  description: `${preset.label} preset imported from the AdminCN reference catalog.`,
  tokens: {
    light: mergeThemeTokens(
      shadcnDefaultTheme.tokens.light,
      preset.styles.light
    ),
    dark: mergeThemeTokens(shadcnDefaultTheme.tokens.dark, preset.styles.dark),
  },
}));

const editorialThemeOptions: StudioThemeOption[] = Object.entries(
  editorialThemePresets
).map(([themeId, preset]) => ({
  id: themeId as StudioThemeOption["id"],
  kind: "editorial" as const,
  label: preset.label,
  description: preset.description,
  tokens: {
    light: mergeThemeTokens(
      shadcnDefaultTheme.tokens.light,
      preset.styles.light
    ),
    dark: mergeThemeTokens(shadcnDefaultTheme.tokens.dark, preset.styles.dark),
  },
}));

export const studioThemeConfig = {
  defaultThemeId: "afenda-brand",
  defaultMode: "system",
  storageKey: "afenda-studio-v2-theme",
  darkClassName: "dark",
  themes: [
    shadcnDefaultTheme,
    afendaBrandTheme,
    ...admincnThemeOptions,
    ...editorialThemeOptions,
  ],
} as const satisfies StudioThemeConfig;
