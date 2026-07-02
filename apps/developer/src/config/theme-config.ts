import type {
  ThemeFont,
  ThemeLayout,
  ThemeMode,
  ThemePresetSlug,
  ThemeRadius,
  ThemeScale,
  ThemeSidebarCollapsible,
  ThemeSidebarVariant,
} from "@afenda/shadcn-studio/theme";

export interface LabThemeConfig {
  readonly defaultMode: ThemeMode;
  readonly defaultPreset: ThemePresetSlug;
  readonly font: ThemeFont;
  readonly layout: ThemeLayout;
  readonly radius: ThemeRadius;
  readonly scale: ThemeScale;
  readonly settingsStorageKey: string;
  readonly sidebarCollapsible: ThemeSidebarCollapsible;
  readonly sidebarOpen: boolean;
  readonly sidebarVariant: ThemeSidebarVariant;
}

/** Lab defaults for appearance settings — isolated by port 3002 origin. */
export const labThemeConfig = {
  settingsStorageKey: "afenda-developer-lab-settings",
  defaultMode: "system",
  defaultPreset: "default",
  font: "geist",
  radius: "md",
  scale: "md",
  layout: "full",
  sidebarVariant: "inset",
  sidebarCollapsible: "icon",
  sidebarOpen: true,
} as const satisfies LabThemeConfig;
