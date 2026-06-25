import { AppShellMain } from "@afenda/appshell";
import { notFound } from "next/navigation";

import { UserSecuritySettingsPanel } from "@/components/user-settings/user-security-settings-panel";
import { resolveUserSecuritySettings } from "@/lib/user-settings/resolve-user-security-settings.server";

export default async function UserSettingsSecurityPage() {
  const settingsResult = await resolveUserSecuritySettings();

  if (settingsResult.kind !== "ready") {
    notFound();
  }

  return (
    <AppShellMain
      contentLabel="Security settings"
      description="Personal MFA enrollment and active session management."
      title="Security"
    >
      <UserSecuritySettingsPanel initialSettings={settingsResult.settings} />
    </AppShellMain>
  );
}
