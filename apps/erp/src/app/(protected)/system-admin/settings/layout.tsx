import type { ReactNode } from "react";

import { SettingsTabNav } from "@/components/system-admin/settings-tab-nav";

const SETTINGS_TABS = [
  { label: "General", href: "/system-admin/settings/general" },
  { label: "Notifications", href: "/system-admin/settings/notifications" },
  { label: "Workspace", href: "/system-admin/settings/workspace" },
  { label: "Integrations", href: "/system-admin/settings/integrations" },
  { label: "Members", href: "/system-admin/settings/members" },
  { label: "Security", href: "/system-admin/settings/security" },
  { label: "Billing & Usage", href: "/system-admin/settings/billing" },
  { label: "Appearance", href: "/system-admin/settings/appearance" },
] as const satisfies ReadonlyArray<{
  readonly href: string;
  readonly label: string;
}>;

export default function SystemAdminSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="erp-system-admin-settings-layout">
      <SettingsTabNav tabs={SETTINGS_TABS} />
      <div className="erp-system-admin-settings-layout__content">
        {children}
      </div>
    </div>
  );
}
