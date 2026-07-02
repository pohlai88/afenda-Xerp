import type { Metadata } from "next";
import { loadAppearanceSettingsPage } from "@/lib/lab/load-appearance-settings-page.server";
import { AppearanceSettingsPanel } from "./_components/appearance-settings-panel";

export const metadata: Metadata = {
  title: "Appearance",
};

export default async function AppearanceSettingsPage() {
  const model = await loadAppearanceSettingsPage();
  return <AppearanceSettingsPanel model={model} />;
}
