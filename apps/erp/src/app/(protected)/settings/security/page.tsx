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
  const mfaRequiredNotice =
    params.notice === "mfa-required" ? (
      <p
        aria-label="Organization requires two-factor authentication"
        className="erp-system-admin-settings-form__message"
        role="status"
      >
        Your organization requires two-factor authentication before you can
        access workspace features. Enroll below, then return to your previous
        task.
      </p>
    ) : null;

  if (settingsResult.kind !== "ready") {
    if (params.notice === "mfa-required") {
      return (
        <AppShellMain
          contentLabel="Security settings"
          description="Personal MFA enrollment and active session management."
          title="Security"
        >
          {mfaRequiredNotice}
        </AppShellMain>
      );
    }

    notFound();
  }

  return (
    <AppShellMain
      contentLabel="Security settings"
      description="Personal MFA enrollment and active session management."
      title="Security"
    >
      {mfaRequiredNotice}
      <UserSecuritySettingsPanel initialSettings={settingsResult.settings} />
    </AppShellMain>
  );
}
