import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import type { Metadata } from "next";
import {
  createAppearanceSettingsMetadata,
  loadSettingsAppearancePage,
} from "@/lib/lab/load-settings-appearance-page.server";
import { AppearanceGuidelinesPanel } from "./_components/appearance-guidelines-panel";
import { AppearanceThemePanel } from "./_components/appearance-theme-panel";

export async function generateMetadata(): Promise<Metadata> {
  return createAppearanceSettingsMetadata();
}

export default async function AppearanceSettingsPage() {
  const pageData = await loadSettingsAppearancePage();

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
            Theme Surface
          </p>
          <h1 className="font-semibold text-3xl tracking-tight">
            {pageData.title}
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            {pageData.description}
          </p>
        </div>
        <Card className="w-full max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Future ERP integration</CardTitle>
            <CardDescription>{pageData.promotionSummary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="rounded-2xl bg-muted px-3 py-2">
              ERP target: {pageData.promotion.futureErpPath}
            </p>
            <p className="text-muted-foreground">{pageData.promotion.notes}</p>
          </CardContent>
        </Card>
      </header>
      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <AppearanceGuidelinesPanel pageData={pageData} />
        <AppearanceThemePanel pageData={pageData} />
      </div>
    </section>
  );
}
