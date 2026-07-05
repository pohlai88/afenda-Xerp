import { themeConfig } from "./config.defaults.js";
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

export interface Settings {
  font: ThemeFont;
  layout: ThemeLayout;
  mode: ThemeMode;
  radius: ThemeRadius;
  scale: ThemeScale;
  sidebarCollapsible: ThemeSidebarCollapsible;
  sidebarOpen: boolean;
  sidebarVariant: ThemeSidebarVariant;
  themePreset: ThemePresetSlug;
}

export const initialSettings = {
  mode: themeConfig.mode,
  themePreset: themeConfig.themePreset,
  font: themeConfig.font,
  radius: themeConfig.radius,
  scale: themeConfig.scale,
  layout: themeConfig.layout,
  sidebarVariant: themeConfig.sidebarVariant,
  sidebarCollapsible: themeConfig.sidebarCollapsible,
  sidebarOpen: themeConfig.sidebarOpen,
} satisfies Settings;
