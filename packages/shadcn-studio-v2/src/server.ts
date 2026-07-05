// biome-ignore lint/performance/noBarrelFile: V2 root public files are explicit package boundary surfaces, not convenience barrels.
export { studioPackageConfig } from "./configs/studio-config";
export { studioThemeConfig } from "./configs/theme-config";
export type { StudioPackageConfig } from "./types/studio";
export type {
  StudioResolvedThemeMode,
  StudioThemeConfig,
  StudioThemeId,
  StudioThemeMode,
  StudioThemeOption,
  StudioThemeState,
  StudioThemeUpdate,
} from "./types/theme";
