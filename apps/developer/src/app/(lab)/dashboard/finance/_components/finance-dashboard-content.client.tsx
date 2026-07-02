"use client";

import {
  ChartTotalRevenueBlock,
  StatisticsCard01Block,
  StatisticsCard02Block,
  StatisticsCard03Block,
  StatisticsCard04Block,
} from "@afenda/shadcn-studio";
import {
  CircleDollarSignIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import type { LabMetricIconKey } from "@/lib/lab/fixtures/dashboard-sales.fixtures";
import type { DashboardFinancePageModel } from "@/lib/lab/load-dashboard-finance-page.server";

const METRIC_ICONS: Record<LabMetricIconKey, ReactNode> = {
  dollar: <DollarSignIcon className="size-4" />,
  users: <UsersIcon className="size-4" />,
  cart: <ShoppingCartIcon className="size-4" />,
  trend: <TrendingUpIcon className="size-4" />,
};

const YEAR_SUMMARY_ICONS = {
  "circle-dollar": <CircleDollarSignIcon className="size-5" />,
  wallet: <WalletIcon className="size-5" />,
} as const;

export interface FinanceDashboardContentProps {
  readonly model: DashboardFinancePageModel;
}

export function FinanceDashboardContent({
  model,
}: FinanceDashboardContentProps) {
  const { page } = model;
  const [card1, card2, card3, card4] = page.metricCards;
  const { totalRevenue } = page;

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

      <ChartTotalRevenueBlock
        barChartData={[...totalRevenue.barChartData]}
        growthCenterLabel={totalRevenue.growthCenterLabel}
        growthCenterValue={totalRevenue.growthCenterValue}
        growthFootnote={totalRevenue.growthFootnote}
        growthPieData={[...totalRevenue.growthPieData]}
        title={totalRevenue.title}
        yearSummaries={totalRevenue.yearSummaries.map((summary) => ({
          amount: summary.amount,
          icon: YEAR_SUMMARY_ICONS[summary.iconKey],
          year: summary.year,
        }))}
      />
    </>
  );
}
