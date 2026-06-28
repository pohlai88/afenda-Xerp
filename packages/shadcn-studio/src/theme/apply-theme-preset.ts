import {
  assertThemePresetSlug,
  type NamedThemePresetSlug,
  PRESET_CSS_VARS,
  type ThemePresetSlug,
} from "./theme-preset.contract.js";
import { themePresets } from "./theme-presets.js";

export type ResolvedColorMode = "light" | "dark";

export function clearThemePresetStyles(root: HTMLElement): void {
  for (const key of PRESET_CSS_VARS) {
    root.style.removeProperty(`--${key}`);
  }
}

export function applyThemePresetStyles(
  root: HTMLElement,
  presetSlug: ThemePresetSlug,
  mode: ResolvedColorMode
): void {
  const slug = assertThemePresetSlug(presetSlug);

  if (slug === "default") {
    clearThemePresetStyles(root);
    return;
  }

  const preset = themePresets[slug as NamedThemePresetSlug];
  const styles = preset.styles[mode];

  for (const [key, value] of Object.entries(styles)) {
    if (value !== undefined) {
      root.style.setProperty(`--${key}`, value);
    }
  }
}
