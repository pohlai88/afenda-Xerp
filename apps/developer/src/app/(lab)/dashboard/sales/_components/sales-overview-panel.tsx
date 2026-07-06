"use client";

import { MetricWidget } from "@afenda/shadcn-studio-v2/clients";
import type { SalesDashboardPageData } from "@/lib/lab/contracts";

interface SalesOverviewPanelProps {
  readonly pageData: SalesDashboardPageData;
}

export function SalesOverviewPanel({ pageData }: SalesOverviewPanelProps) {
  return (
    <section className="grid gap-6">
      <MetricWidget
        description={`${pageData.revenue.periodLabel} · ${pageData.revenue.changePercentage}% change`}
        label={pageData.revenue.title}
        tone="success"
        value={pageData.revenue.amount}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <MetricWidget
          description={`${pageData.overview.changePercentage} period change`}
          label={pageData.overview.title}
          value={pageData.overview.totalValue}
        />
        <MetricWidget
          description={`${pageData.overview.deliveredSide.percentage} delivered`}
          label={pageData.overview.deliveredSide.label}
          value={pageData.overview.deliveredSide.count}
        />
        <MetricWidget
          description={`${pageData.overview.orderSide.percentage} of orders`}
          label={pageData.overview.orderSide.label}
          value={pageData.overview.orderSide.count}
        />
      </div>
    </section>
  );
}
