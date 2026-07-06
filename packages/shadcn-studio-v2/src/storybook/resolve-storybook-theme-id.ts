import { studioThemeConfig } from "../configs/theme-config";
import type { StudioThemeId } from "../types/theme";

const V1_DEFAULT_PRESET = "default" as const;

const V1_PRESET_TO_V2_THEME = {
  [V1_DEFAULT_PRESET]: "shadcn-default",
} as const satisfies Record<typeof V1_DEFAULT_PRESET, StudioThemeId>;

const APPROVED_THEME_IDS = new Set<StudioThemeId>(
  studioThemeConfig.themes.map((theme) => theme.id)
);

export function resolveStorybookThemeId(preset: string): StudioThemeId {
  if (preset === V1_DEFAULT_PRESET) {
    return V1_PRESET_TO_V2_THEME[V1_DEFAULT_PRESET];
  }

  if (APPROVED_THEME_IDS.has(preset as StudioThemeId)) {
    return preset as StudioThemeId;
  }

  return "shadcn-default";
}
