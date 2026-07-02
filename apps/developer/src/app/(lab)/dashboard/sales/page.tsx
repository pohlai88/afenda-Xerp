import type { Metadata } from "next";
import { loadDashboardSalesPage } from "@/lib/lab/load-dashboard-sales-page.server";
import { SalesDashboardPanel } from "./_components/sales-dashboard-panel";

export const metadata: Metadata = {
  title: "Sales dashboard",
};

export default async function SalesDashboardPage() {
  const model = await loadDashboardSalesPage();
  return <SalesDashboardPanel model={model} />;
}
