import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@afenda/shadcn-studio";
import type { Metadata } from "next";
import { loadSettingsAppearancePage } from "@/lib/lab/load-settings-appearance-page.server";
import { AppearanceThemePanel } from "./_components/appearance-theme-panel";

export const metadata: Metadata = {
  title: "Appearance Settings Review",
  description:
    "Theme and appearance route in the Afenda route lab, validating settings composition before any ERP persistence exists.",
};

export default async function AppearanceSettingsPage() {
  const pageData = await loadSettingsAppearancePage();

  return (
    <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
      <Card className="h-fit">
        <CardHeader>
          <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
            Theme Surface
          </p>
          <h1 className="font-semibold text-3xl tracking-tight">
            {pageData.title}
          </h1>
          <CardDescription>{pageData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {pageData.guidelines.map((item) => (
            <div className="rounded-2xl bg-muted px-4 py-3" key={item.title}>
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-muted-foreground">{item.summary}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <AppearanceThemePanel />
    </section>
  );
}
