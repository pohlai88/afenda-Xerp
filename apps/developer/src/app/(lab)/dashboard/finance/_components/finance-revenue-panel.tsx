"use client";

import { MetricWidget } from "@afenda/shadcn-studio-v2/clients";
import type { FinanceDashboardPageData } from "@/lib/lab/contracts";

interface FinanceRevenuePanelProps {
  readonly pageData: FinanceDashboardPageData;
}

export function FinanceRevenuePanel({ pageData }: FinanceRevenuePanelProps) {
  return (
    <MetricWidget
      description={`${pageData.revenue.periodLabel} · ${pageData.revenue.changePercentage}% change`}
      label={pageData.revenue.title}
      tone="success"
      value={pageData.revenue.amount}
    />
  );
}
