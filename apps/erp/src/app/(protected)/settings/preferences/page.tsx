import { AppShellMain } from "@afenda/appshell";
import { notFound } from "next/navigation";

import { UserPreferencesSettingsPanel } from "@/components/user-settings/user-preferences-settings-panel";
import { resolveUserPreferences } from "@/lib/user-settings/resolve-user-preferences.server";

export default async function UserSettingsPreferencesPage() {
  const preferencesResult = await resolveUserPreferences();

  if (preferencesResult.kind !== "ready") {
    notFound();
  }

  return (
    <AppShellMain
      contentLabel="Preference settings"
      description="Theme, language, density, and timezone for your personal Afenda experience."
      title="Preferences"
    >
      <UserPreferencesSettingsPanel
        initialPreferences={preferencesResult.preferences.display}
      />
    </AppShellMain>
  );
}
