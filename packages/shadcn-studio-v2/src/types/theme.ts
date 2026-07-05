export type StudioThemeId = "shadcn-default" | "swiss-noir" | "verdant-noir";

export type StudioThemeMode = "light" | "dark" | "system";

export type StudioResolvedThemeMode = "light" | "dark";

export interface StudioThemeOption {
  readonly description: string;
  readonly id: StudioThemeId;
  readonly label: string;
  readonly selector:
    | ":root"
    | '[data-theme="swiss-noir"]'
    | '[data-theme="verdant-noir"]';
}

export interface StudioThemeConfig {
  readonly darkClassName: "dark";
  readonly defaultMode: StudioThemeMode;
  readonly defaultThemeId: StudioThemeId;
  readonly storageKey: string;
  readonly themeAttribute: "data-theme";
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
