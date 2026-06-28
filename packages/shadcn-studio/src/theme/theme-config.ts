import type {
  ThemeFont,
  ThemeMode,
  ThemePresetSlug,
  ThemeRadius,
  ThemeScale,
} from "./theme-preset.contract.js";

export interface ThemeConfig {
  font: ThemeFont;
  mode: ThemeMode;
  radius: ThemeRadius;
  scale: ThemeScale;
  settingsStorageKey: string;
  themePreset: ThemePresetSlug;
}

export const themeConfig = {
  settingsStorageKey: "shadcn-studio-settings",
  mode: "system",
  themePreset: "default",
  font: "geist",
  radius: "md",
  scale: "md",
} as const satisfies ThemeConfig;

export default themeConfig;
