export type StudioThemeId =
  | "shadcn-default"
  | "caffeine"
  | "claude"
  | "corporate"
  | "ghibli-studio"
  | "marvel"
  | "material-design"
  | "modern-minimal"
  | "nature"
  | "perplexity"
  | "slack"
  | "pastel-dreams"
  | "swiss-noir"
  | "verdant-noir";

export type StudioThemeMode = "light" | "dark" | "system";

export type StudioResolvedThemeMode = Exclude<StudioThemeMode, "system">;

export type StudioThemeTokenName =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "border"
  | "input"
  | "ring"
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "sidebar"
  | "sidebar-foreground"
  | "sidebar-primary"
  | "sidebar-primary-foreground"
  | "sidebar-accent"
  | "sidebar-accent-foreground"
  | "sidebar-border"
  | "sidebar-ring";

export type StudioThemeTokenMap = Readonly<
  Record<StudioThemeTokenName, string>
>;

export type StudioThemeTokenModeMap = Readonly<
  Record<StudioResolvedThemeMode, StudioThemeTokenMap>
>;

export interface StudioThemeOption {
  readonly description: string;
  readonly id: StudioThemeId;
  readonly label: string;
  readonly tokens: StudioThemeTokenModeMap;
}

export interface StudioThemeConfig {
  readonly darkClassName: string;
  readonly defaultMode: StudioThemeMode;
  readonly defaultThemeId: StudioThemeId;
  readonly storageKey: string;
  readonly themes: readonly StudioThemeOption[];
}

export interface StudioThemeState {
  readonly mode: StudioThemeMode;
  readonly resolvedMode: StudioResolvedThemeMode;
  readonly themeId: StudioThemeId;
}

export interface StudioThemeUpdate {
  readonly mode?: StudioThemeMode;
  readonly themeId?: StudioThemeId;
}
