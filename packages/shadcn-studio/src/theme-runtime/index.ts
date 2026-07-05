/**
 * Client-safe theme surface — no node:fs dependencies.
 * ERP/Storybook shells should import presentation providers from here, not the main barrel.
 */

export {
  themeConfig,
  themeConfig as themeConfigValues,
} from "../theme-config/config.defaults.js";
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
} from "../theme-config/config.preset.contract.js";
export { themePresets } from "../theme-config/config.presets.js";
export {
  initialSettings,
  type Settings,
} from "../theme-config/config.settings.contract.js";
export {
  applyThemePresetStyles,
  clearThemePresetStyles,
  type ResolvedColorMode,
} from "./theme-runtime.apply-preset-styles.js";
export { ThemeCustomizer } from "./theme-runtime.customizer-panel.js";
export {
  ErpPresentationProviders,
  type ErpPresentationProvidersProps,
} from "./theme-runtime.erp-providers.js";
export {
  type SettingsContextValue,
  SettingsProvider,
  type SettingsProviderProps,
  useSettings,
} from "./theme-runtime.settings-provider.js";
export {
  parseStoredSettings,
  readStoredSettings,
  type StoredSettings,
  serializeSettings,
} from "./theme-runtime.settings-storage.js";
