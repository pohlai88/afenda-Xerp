import type { StudioThemeConfig } from "./theme";

export interface StudioPackageConfig {
  readonly defaultExportSurface: "neutral";
  readonly packageName: "@afenda/shadcn-studio-v2";
  readonly taxonomyVersion: "v2";
}

export interface StudioRuntimeState {
  readonly packageConfig: StudioPackageConfig;
  readonly themeConfig: StudioThemeConfig;
}
