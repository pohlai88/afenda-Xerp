import type {
  ThemeFont,
  ThemeLayout,
  ThemeMode,
  ThemePresetSlug,
  ThemeRadius,
  ThemeScale,
  ThemeSidebarCollapsible,
  ThemeSidebarVariant,
} from "./config.preset.contract.js";

export interface ThemeConfig {
  font: ThemeFont;
  layout: ThemeLayout;
  mode: ThemeMode;
  radius: ThemeRadius;
  scale: ThemeScale;
  settingsStorageKey: string;
  sidebarCollapsible: ThemeSidebarCollapsible;
  sidebarOpen: boolean;
  sidebarVariant: ThemeSidebarVariant;
  themePreset: ThemePresetSlug;
}

export const themeConfig = {
  settingsStorageKey: "shadcn-studio-settings",
  mode: "system",
  themePreset: "default",
  font: "geist",
  radius: "md",
  scale: "md",
  layout: "full",
  sidebarVariant: "inset",
  sidebarCollapsible: "icon",
  sidebarOpen: true,
} as const satisfies ThemeConfig;
