import {
  StatisticsRevenueCardBlock,
  StatisticsSalesOverviewCardBlock,
} from "@afenda/shadcn-studio";
import type { SalesDashboardPageData } from "@/lib/lab/contracts";

interface SalesOverviewPanelProps {
  readonly pageData: SalesDashboardPageData;
}

export function SalesOverviewPanel({ pageData }: SalesOverviewPanelProps) {
  return (
    <section className="grid gap-6">
      <StatisticsRevenueCardBlock
        amount={pageData.revenue.amount}
        changePercentage={pageData.revenue.changePercentage}
        chartData={pageData.revenue.chartData}
        periodLabel={pageData.revenue.periodLabel}
        title={pageData.revenue.title}
      />
      <StatisticsSalesOverviewCardBlock
        changePercentage={pageData.overview.changePercentage}
        deliveredSide={pageData.overview.deliveredSide}
        orderSide={pageData.overview.orderSide}
        progressValue={pageData.overview.progressValue}
        title={pageData.overview.title}
        totalValue={pageData.overview.totalValue}
      />
    </section>
  );
}
