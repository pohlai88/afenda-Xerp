import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatisticsRevenueCardBlock,
} from "@afenda/shadcn-studio";
import type { Metadata } from "next";
import { loadDashboardFinancePage } from "@/lib/lab/load-dashboard-finance-page.server";

export const metadata: Metadata = {
  title: "Finance Readiness View",
  description:
    "Secondary finance dashboard route in the Afenda route lab, proving the same page, loader, and composition law as the canonical sales route.",
};

export default async function FinanceDashboardPage() {
  const pageData = await loadDashboardFinancePage();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="font-medium text-primary text-xs uppercase tracking-[0.28em]">
          Secondary Route Pattern
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          {pageData.title}
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          {pageData.description}
        </p>
      </header>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <StatisticsRevenueCardBlock
          amount={pageData.revenue.amount}
          changePercentage={pageData.revenue.changePercentage}
          chartData={pageData.revenue.chartData}
          periodLabel={pageData.revenue.periodLabel}
          title={pageData.revenue.title}
        />
        <Card>
          <CardHeader>
            <CardTitle>Controls for later ERP wiring</CardTitle>
            <CardDescription>{pageData.promotionSummary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {pageData.focusAreas.map((item) => (
              <div className="rounded-2xl bg-muted px-4 py-3" key={item.title}>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-muted-foreground">{item.summary}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
