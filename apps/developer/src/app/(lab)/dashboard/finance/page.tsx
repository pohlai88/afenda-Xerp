import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@afenda/shadcn-studio";
import type { Metadata } from "next";
import {
  createFinanceDashboardMetadata,
  loadDashboardFinancePage,
} from "@/lib/lab/load-dashboard-finance-page.server";
import { FinanceFocusPanel } from "./_components/finance-focus-panel";
import { FinanceRevenuePanel } from "./_components/finance-revenue-panel";

export async function generateMetadata(): Promise<Metadata> {
  return createFinanceDashboardMetadata();
}

export default async function FinanceDashboardPage() {
  const pageData = await loadDashboardFinancePage();

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
            Secondary Route Pattern
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
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <FinanceRevenuePanel pageData={pageData} />
        <FinanceFocusPanel pageData={pageData} />
      </div>
    </section>
  );
}
