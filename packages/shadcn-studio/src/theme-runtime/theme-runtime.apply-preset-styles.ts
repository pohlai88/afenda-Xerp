import {
  assertThemePresetSlug,
  isNamedThemePresetSlug,
  PRESET_CSS_VARS,
  type PresetCssVar,
  type ThemePresetSlug,
} from "../theme-config/config.preset.contract.js";
import { themePresets } from "../theme-config/config.presets.js";

export type ResolvedColorMode = "light" | "dark";

export function resolveColorMode(
  resolvedTheme: string | undefined
): ResolvedColorMode {
  return resolvedTheme === "dark" ? "dark" : "light";
}

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

  clearThemePresetStyles(root);

  const presetValues = themePresets[slug].styles[mode] as Partial<
    Record<PresetCssVar, string>
  >;

  for (const key of PRESET_CSS_VARS) {
    const value = presetValues[key];

    if (value !== undefined) {
      root.style.setProperty(`--${key}`, value);
    }
  }
}
