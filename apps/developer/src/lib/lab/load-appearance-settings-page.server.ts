import { labThemeConfig } from "@/config/theme-config";

export interface AppearanceSettingsPageModel {
  readonly description: string;
  readonly settingsStorageKey: string;
  readonly title: string;
}

export function loadAppearanceSettingsPage(): AppearanceSettingsPageModel {
  return {
    title: "Appearance",
    description:
      "Theme provider and preset controls wired from config/theme-config.ts — lab origin only.",
    settingsStorageKey: labThemeConfig.settingsStorageKey,
  };
}
