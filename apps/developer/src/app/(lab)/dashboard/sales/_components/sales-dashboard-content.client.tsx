"use client";

import {
  ChartSalesMetricsBlock,
  StatisticsCard01Block,
  StatisticsCard02Block,
  StatisticsCard03Block,
  StatisticsCard04Block,
} from "@afenda/shadcn-studio";
import {
  DollarSignIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { LabMetricIconKey } from "@/lib/lab/fixtures/dashboard-sales.fixtures";
import type { DashboardSalesPageModel } from "@/lib/lab/load-dashboard-sales-page.server";

const METRIC_ICONS: Record<LabMetricIconKey, ReactNode> = {
  dollar: <DollarSignIcon className="size-4" />,
  users: <UsersIcon className="size-4" />,
  cart: <ShoppingCartIcon className="size-4" />,
  trend: <TrendingUpIcon className="size-4" />,
};

const SALES_METRIC_ICONS: Record<LabMetricIconKey, ReactNode> = {
  dollar: <DollarSignIcon className="size-5" />,
  users: <UsersIcon className="size-5" />,
  cart: <ShoppingBagIcon className="size-5" />,
  trend: <TrendingUpIcon className="size-5" />,
};

export interface SalesDashboardContentProps {
  readonly model: DashboardSalesPageModel;
}

export function SalesDashboardContent({ model }: SalesDashboardContentProps) {
  const { page } = model;
  const [card1, card2, card3, card4] = page.metricCards;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard01Block
          changePercentage={card1.changePercentage}
          icon={METRIC_ICONS[card1.iconKey]}
          title={card1.title}
          value={card1.value}
        />
        <StatisticsCard02Block
          changePercentage={card2.changePercentValue ?? 0}
          icon={METRIC_ICONS[card2.iconKey]}
          title={card2.title}
          value={card2.value}
        />
        <StatisticsCard03Block
          badgeContent="Monthly"
          changePercentage={card3.changePercentage}
          icon={METRIC_ICONS[card3.iconKey]}
          title={card3.title}
          trend="up"
          value={card3.value}
        />
        <StatisticsCard04Block
          badgeContent="Monthly"
          changePercentage={card4.changePercentValue ?? 0}
          svg={
            <TrendingUpIcon aria-hidden className="size-16 text-primary/25" />
          }
          title={card4.title}
          value={card4.value}
        />
      </div>

      <ChartSalesMetricsBlock
        company={page.salesMetrics.company}
        metrics={page.salesMetrics.metrics.map((metric) => ({
          icon: SALES_METRIC_ICONS[metric.iconKey],
          title: metric.title,
          value: metric.value,
        }))}
        planCompletedLabel={page.salesMetrics.planCompletedLabel}
        planCompletedPercent={page.salesMetrics.planCompletedPercent}
        revenueCenterLabel={page.salesMetrics.revenueCenterLabel}
        revenueCenterValue={page.salesMetrics.revenueCenterValue}
        revenueGoalTitle={page.salesMetrics.revenueGoalTitle}
        revenuePieData={[...page.salesMetrics.revenuePieData]}
        salesBarChartData={[...page.salesMetrics.salesBarChartData]}
        salesPlanDescription={page.salesMetrics.salesPlanDescription}
        salesPlanPercentage={page.salesMetrics.salesPlanPercentage}
        salesPlanTitle={page.salesMetrics.salesPlanTitle}
        title={page.salesMetrics.title}
      />
    </>
  );
}
