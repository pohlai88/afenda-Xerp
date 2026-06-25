import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { UserSettingsTabNav } from "@/components/user-settings/user-settings-tab-nav";
import { resolveUserSettingsOperatingContext } from "@/lib/user-settings/resolve-user-settings-context.server";
import { USER_SETTINGS_TABS } from "@/lib/user-settings/user-settings-tabs.contract";

export default async function UserSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const contextResult = await resolveUserSettingsOperatingContext();

  if (contextResult.kind === "redirect") {
    redirect(contextResult.href);
  }

  if (contextResult.kind === "forbidden") {
    redirect("/");
  }

  return (
    <div className="erp-user-settings-layout">
      <UserSettingsTabNav tabs={USER_SETTINGS_TABS} />
      <div className="erp-user-settings-layout__content">{children}</div>
    </div>
  );
}
