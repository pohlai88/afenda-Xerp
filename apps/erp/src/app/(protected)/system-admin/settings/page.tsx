import {
  SystemAdminSectionHeaderBlock as SystemAdminSectionHeader,
  SystemAdminSettingsTableBlock as SystemAdminSettingsTable,
} from "@afenda/shadcn-studio";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { listSystemAdminSettings } from "@/server/system-admin/list-system-admin-settings.server";

export const metadata = {
  title: "Settings",
};

export default async function SystemAdminSettingsPage() {
  await loadSystemAdminSectionPage("settings");
  const { modules } = await listSystemAdminSettings();

  return (
    <section className="flex flex-col gap-4">
      <SystemAdminSectionHeader
        description="Module domain summaries derived from the governed permission catalog."
        title="Settings"
      />
      <SystemAdminSettingsTable modules={modules} />
    </section>
  );
}
