import {
  assertThemePresetSlug,
  isNamedThemePresetSlug,
  PRESET_CSS_VARS,
  type PresetCssVar,
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

  if (!isNamedThemePresetSlug(slug)) {
    clearThemePresetStyles(root);
    return;
  }

  const styles = themePresets[slug].styles[mode];

  for (const [key, value] of Object.entries(styles) as [
    PresetCssVar,
    string | undefined,
  ][]) {
    if (value !== undefined) {
      root.style.setProperty(`--${key}`, value);
    }
  }
}
