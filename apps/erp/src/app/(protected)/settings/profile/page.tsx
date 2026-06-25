import { AppShellMain } from "@afenda/appshell";
import { notFound } from "next/navigation";

import { UserProfileSettingsPanel } from "@/components/user-settings/user-profile-settings-panel";
import { resolveUserProfileSettings } from "@/lib/user-settings/resolve-user-profile-settings.server";

export default async function UserSettingsProfilePage() {
  const profileResult = await resolveUserProfileSettings();

  if (profileResult.kind !== "ready") {
    notFound();
  }

  return (
    <AppShellMain
      contentLabel="Profile settings"
      description="Personal profile, email, and password."
      title="Profile"
    >
      <UserProfileSettingsPanel profile={profileResult.profile} />
    </AppShellMain>
  );
}
