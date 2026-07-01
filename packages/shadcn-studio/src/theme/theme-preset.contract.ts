/** PAS-006A — typed theme preset contracts (Afenda-free Phase 1). */

export interface ThemeStyleProps {
  accent: string;
  "accent-foreground": string;
  background: string;
  border: string;
  card: string;
  "card-foreground": string;
  "chart-1": string;
  "chart-2": string;
  "chart-3": string;
  "chart-4": string;
  "chart-5": string;
  destructive: string;
  "destructive-foreground"?: string;
  foreground: string;
  input: string;
  "letter-spacing"?: string;
  muted: string;
  "muted-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  radius?: string;
  ring: string;
  secondary: string;
  "secondary-foreground": string;
  "shadow-blur"?: string;
  "shadow-color"?: string;
  "shadow-offset-x"?: string;
  "shadow-offset-y"?: string;
  "shadow-opacity"?: string;
  "shadow-spread"?: string;
  sidebar: string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-ring": string;
  spacing?: string;
}

export interface ThemeStyles {
  dark: Partial<ThemeStyleProps>;
  light: Partial<ThemeStyleProps>;
}

export interface ThemePreset {
  label: string;
  styles: ThemeStyles;
}

export const NAMED_THEME_PRESET_SLUGS = [
  "caffeine",
  "claude",
  "corporate",
  "ghibli-studio",
  "marvel",
  "material-design",
  "modern-minimal",
  "nature",
  "perplexity",
  "slack",
  "pastel-dreams",
] as const;

export type NamedThemePresetSlug = (typeof NAMED_THEME_PRESET_SLUGS)[number];

export const THEME_PRESET_SLUGS = [
  "default",
  ...NAMED_THEME_PRESET_SLUGS,
] as const;

export type ThemePresetSlug = (typeof THEME_PRESET_SLUGS)[number];

export type ThemePresetMap = Record<NamedThemePresetSlug, ThemePreset>;

export const PRESET_CSS_VARS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
  "shadow-color",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
] as const;

export type PresetCssVar = (typeof PRESET_CSS_VARS)[number];

export function isThemePresetSlug(value: string): value is ThemePresetSlug {
  return (THEME_PRESET_SLUGS as readonly string[]).includes(value);
}

export function isNamedThemePresetSlug(
  slug: ThemePresetSlug
): slug is NamedThemePresetSlug {
  return slug !== "default";
}

/** Fail-closed: throws when slug is not in the typed union. */
export function assertThemePresetSlug(value: string): ThemePresetSlug {
  if (!isThemePresetSlug(value)) {
    throw new Error(`Invalid theme preset slug: "${value}"`);
  }

  return value;
}

export type ThemeMode = "light" | "dark" | "system";

export type ThemeRadius = "none" | "sm" | "md" | "lg";

export type ThemeScale = "sm" | "md" | "lg";

export const THEME_MODES = [
  "light",
  "dark",
  "system",
] as const satisfies readonly ThemeMode[];

export const THEME_RADII = [
  "none",
  "sm",
  "md",
  "lg",
] as const satisfies readonly ThemeRadius[];

export const THEME_SCALES = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly ThemeScale[];

export function isThemeMode(value: string): value is ThemeMode {
  return (THEME_MODES as readonly string[]).includes(value);
}

export function isThemeRadius(value: string): value is ThemeRadius {
  return (THEME_RADII as readonly string[]).includes(value);
}

export function isThemeScale(value: string): value is ThemeScale {
  return (THEME_SCALES as readonly string[]).includes(value);
}

export type ThemeLayout = "compact" | "full";

export type ThemeSidebarVariant = "default" | "inset" | "floating";

export type ThemeSidebarCollapsible = "offcanvas" | "icon" | "none";

export type ThemeFont = "geist" | "inter" | "system";

export const THEME_FONTS = [
  "geist",
  "inter",
  "system",
] as const satisfies readonly ThemeFont[];

export const THEME_LAYOUTS = [
  "compact",
  "full",
] as const satisfies readonly ThemeLayout[];

export const THEME_SIDEBAR_VARIANTS = [
  "default",
  "inset",
  "floating",
] as const satisfies readonly ThemeSidebarVariant[];

export const THEME_SIDEBAR_COLLAPSIBLES = [
  "offcanvas",
  "icon",
  "none",
] as const satisfies readonly ThemeSidebarCollapsible[];

export function isThemeFont(value: string): value is ThemeFont {
  return (THEME_FONTS as readonly string[]).includes(value);
}

export function isThemeLayout(value: string): value is ThemeLayout {
  return (THEME_LAYOUTS as readonly string[]).includes(value);
}

export function isThemeSidebarVariant(
  value: string
): value is ThemeSidebarVariant {
  return (THEME_SIDEBAR_VARIANTS as readonly string[]).includes(value);
}

export function isThemeSidebarCollapsible(
  value: string
): value is ThemeSidebarCollapsible {
  return (THEME_SIDEBAR_COLLAPSIBLES as readonly string[]).includes(value);
}

export const RADIUS_VALUES = {
  none: "0rem",
  sm: "0.45rem",
  md: "0.625rem",
  lg: "0.875rem",
} as const satisfies Record<ThemeRadius, string>;
