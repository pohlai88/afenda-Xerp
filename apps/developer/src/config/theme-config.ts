import { initialSettings, themeConfig } from "@afenda/shadcn-studio";

export const developerThemeConfig = {
  defaultSettings: initialSettings,
  defaultThemePreset: themeConfig.themePreset,
  layoutMode: themeConfig.layout,
} as const;
