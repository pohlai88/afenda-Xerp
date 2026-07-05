import { StatisticsRevenueCardBlock } from "@afenda/shadcn-studio";
import type { FinanceDashboardPageData } from "@/lib/lab/contracts";

interface FinanceRevenuePanelProps {
  readonly pageData: FinanceDashboardPageData;
}

export function FinanceRevenuePanel({ pageData }: FinanceRevenuePanelProps) {
  return (
    <StatisticsRevenueCardBlock
      amount={pageData.revenue.amount}
      changePercentage={pageData.revenue.changePercentage}
      chartData={pageData.revenue.chartData}
      periodLabel={pageData.revenue.periodLabel}
      title={pageData.revenue.title}
    />
  );
}
