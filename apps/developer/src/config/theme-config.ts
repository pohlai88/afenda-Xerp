import { studioThemeConfig } from "@afenda/shadcn-studio-v2/theme";

export const developerThemeConfig = {
  defaultMode: studioThemeConfig.defaultMode,
  defaultThemeId: studioThemeConfig.defaultThemeId,
  storageKey: studioThemeConfig.storageKey,
} as const;
