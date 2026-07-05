import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import type { Metadata } from "next";
import {
  createSalesDashboardMetadata,
  loadDashboardSalesPage,
} from "@/lib/lab/load-dashboard-sales-page.server";
import { SalesOverviewPanel } from "./_components/sales-overview-panel";
import { SalesProofPanel } from "./_components/sales-proof-panel";

export async function generateMetadata(): Promise<Metadata> {
  return createSalesDashboardMetadata();
}

export default async function SalesDashboardPage() {
  const pageData = await loadDashboardSalesPage();

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
            Canonical Route Pattern
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
            <CardTitle className="text-base">Promotion note</CardTitle>
            <CardDescription>{pageData.promotionSummary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="rounded-2xl bg-muted px-3 py-2">
              ERP target: {pageData.promotion.futureErpPath}
            </p>
            <p className="text-muted-foreground">
              Data source: {pageData.promotion.futureDataSource}
            </p>
          </CardContent>
        </Card>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SalesOverviewPanel pageData={pageData} />
        <SalesProofPanel pageData={pageData} />
      </div>
    </section>
  );
}
