import { AppShellMain } from "@afenda/appshell";
import { notFound } from "next/navigation";

import { UserSecuritySettingsPanel } from "@/components/user-settings/user-security-settings-panel";
import { resolveUserSecuritySettings } from "@/lib/user-settings/resolve-user-security-settings.server";

export default async function UserSettingsSecurityPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
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
      {params.notice === "mfa-required" ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          Your organization requires two-factor authentication before you can
          access workspace features. Enroll below, then return to your previous
          task.
        </p>
      ) : null}
      <UserSecuritySettingsPanel initialSettings={settingsResult.settings} />
    </AppShellMain>
  );
}
