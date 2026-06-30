/**
 * Client-safe theme surface — no node:fs dependencies.
 * ERP/Storybook shells should import presentation providers from here, not the main barrel.
 */

export {
  applyThemePresetStyles,
  clearThemePresetStyles,
  type ResolvedColorMode,
} from "./apply-theme-preset.js";
export {
  ErpPresentationProviders,
  type ErpPresentationProvidersProps,
} from "./erp-presentation-providers.js";
export { initialSettings, type Settings } from "./settings.contract.js";
export {
  type SettingsContextValue,
  SettingsProvider,
  type SettingsProviderProps,
  useSettings,
} from "./settings-context.js";
export {
  parseStoredSettings,
  readStoredSettings,
  type StoredSettings,
  serializeSettings,
} from "./settings-storage.js";
export {
  themeConfig,
  themeConfig as themeConfigValues,
} from "./theme-config.js";
export { ThemeCustomizer } from "./theme-customizer.js";
export {
  assertThemePresetSlug,
  isNamedThemePresetSlug,
  isThemeMode,
  isThemePresetSlug,
  isThemeRadius,
  isThemeScale,
  NAMED_THEME_PRESET_SLUGS,
  type NamedThemePresetSlug,
  PRESET_CSS_VARS,
  type PresetCssVar,
  RADIUS_VALUES,
  THEME_LAYOUTS,
  THEME_MODES,
  THEME_PRESET_SLUGS,
  THEME_RADII,
  THEME_SCALES,
  THEME_SIDEBAR_COLLAPSIBLES,
  THEME_SIDEBAR_VARIANTS,
  type ThemeFont,
  type ThemeLayout,
  type ThemeMode,
  type ThemePreset,
  type ThemePresetMap,
  type ThemePresetSlug,
  type ThemeRadius,
  type ThemeScale,
  type ThemeSidebarCollapsible,
  type ThemeSidebarVariant,
  type ThemeStyleProps,
  type ThemeStyles,
} from "./theme-preset.contract.js";
export { themePresets } from "./theme-presets.js";
