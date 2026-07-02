import type { AppearanceSettingsPageModel } from "@/lib/lab/load-appearance-settings-page.server";

import { AppearanceSettingsContent } from "./appearance-settings-content.client";

export interface AppearanceSettingsPanelProps {
  readonly model: AppearanceSettingsPageModel;
}

export function AppearanceSettingsPanel({
  model,
}: AppearanceSettingsPanelProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="font-semibold text-2xl tracking-tight">{model.title}</h1>
        <p className="text-muted-foreground text-sm">{model.description}</p>
      </header>
      <AppearanceSettingsContent model={model} />
    </div>
  );
}
