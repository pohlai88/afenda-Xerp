import type { DashboardSalesPageModel } from "@/lib/lab/load-dashboard-sales-page.server";

import { SalesDashboardContent } from "./sales-dashboard-content.client";

export interface SalesDashboardPanelProps {
  readonly model: DashboardSalesPageModel;
}

export function SalesDashboardPanel({ model }: SalesDashboardPanelProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <header>
        <h1 className="font-semibold text-2xl tracking-tight">
          {model.page.title}
        </h1>
      </header>
      <SalesDashboardContent model={model} />
    </div>
  );
}
