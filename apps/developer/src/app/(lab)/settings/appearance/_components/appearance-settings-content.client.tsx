"use client";

import { ThemeCustomizer } from "@afenda/shadcn-studio/theme";

import { labThemeConfig } from "@/config/theme-config";
import type { AppearanceSettingsPageModel } from "@/lib/lab/load-appearance-settings-page.server";

export interface AppearanceSettingsContentProps {
  readonly model: AppearanceSettingsPageModel;
}

export function AppearanceSettingsContent({
  model,
}: AppearanceSettingsContentProps) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <ThemeCustomizer />
      <p className="mt-4 text-muted-foreground text-xs">
        Default preset: {labThemeConfig.defaultPreset} · mode:{" "}
        {labThemeConfig.defaultMode} · storage key: {model.settingsStorageKey}
      </p>
    </div>
  );
}
