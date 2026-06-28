/** PAS-005A — @afenda/shadcn-studio public surface (B38 scaffold + B39 theme presets). */

export const SHADCN_STUDIO_PACKAGE_VERSION = "0.0.0" as const;
export const SHADCN_STUDIO_PACKAGE_NAME = "@afenda/shadcn-studio" as const;
export const SHADCN_STUDIO_CSS_PATH = "./shadcn-studio.css" as const;

export {
  shadcnStudioBlockDocs,
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioFullscreenLayout,
  shadcnStudioPaddedLayout,
  shadcnStudioPrimitivesDocs,
  shadcnStudioStoryA11y,
  shadcnStudioThemeLabDocs,
} from "./_storybook/story-parameters.js";
export {
  PlaceholderHeroBlock,
  type PlaceholderHeroBlockProps,
} from "./blocks/placeholder-hero/index.js";
export { Button, buttonVariants } from "./components/ui/button.js";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card.js";
export {
  applyThemePresetStyles,
  clearThemePresetStyles,
  type ResolvedColorMode,
} from "./theme/apply-theme-preset.js";
export {
  initialSettings,
  type Settings,
  type SettingsContextValue,
  SettingsProvider,
  type SettingsProviderProps,
  useSettings,
} from "./theme/settings-context.js";
export {
  default as themeConfig,
  themeConfig as themeConfigValues,
} from "./theme/theme-config.js";
export { ThemeCustomizer } from "./theme/theme-customizer.js";
export {
  assertThemePresetSlug,
  isThemePresetSlug,
  NAMED_THEME_PRESET_SLUGS,
  type NamedThemePresetSlug,
  PRESET_CSS_VARS,
  type PresetCssVar,
  RADIUS_VALUES,
  THEME_PRESET_SLUGS,
  type ThemeFont,
  type ThemeMode,
  type ThemePreset,
  type ThemePresetMap,
  type ThemePresetSlug,
  type ThemeRadius,
  type ThemeScale,
  type ThemeStyleProps,
  type ThemeStyles,
} from "./theme/theme-preset.contract.js";
export { themePresets } from "./theme/theme-presets.js";
