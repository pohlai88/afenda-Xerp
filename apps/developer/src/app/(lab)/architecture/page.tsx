import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio-v2/clients";
import type { Metadata } from "next";
import {
  createArchitectureMapMetadata,
  loadArchitectureMapPage,
} from "@/lib/lab/load-architecture-map-page.server";
import { ArchitectureMapDashboard } from "./_components/architecture-map-dashboard.client";

export async function generateMetadata(): Promise<Metadata> {
  return createArchitectureMapMetadata();
}

export default async function ArchitectureMapPage() {
  const pageData = await loadArchitectureMapPage();

  return (
    <section className="min-w-0 space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
            Governance Visualization
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
            <CardTitle className="text-base">Lab-only mirror</CardTitle>
            <CardDescription>{pageData.promotionSummary}</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            {pageData.promotion.notes}
          </CardContent>
        </Card>
      </header>
      <ArchitectureMapDashboard pageData={pageData} />
    </section>
  );
}
