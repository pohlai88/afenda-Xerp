import type { DashboardFinancePageModel } from "@/lib/lab/load-dashboard-finance-page.server";

import { FinanceDashboardContent } from "./finance-dashboard-content.client";

export interface FinanceDashboardPanelProps {
  readonly model: DashboardFinancePageModel;
}

export function FinanceDashboardPanel({ model }: FinanceDashboardPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="font-semibold text-2xl tracking-tight">
          {model.page.title}
        </h1>
      </header>
      <FinanceDashboardContent model={model} />
    </div>
  );
}
