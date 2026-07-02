import type { Metadata } from "next";
import { loadDashboardFinancePage } from "@/lib/lab/load-dashboard-finance-page.server";
import { FinanceDashboardPanel } from "./_components/finance-dashboard-panel";

export const metadata: Metadata = {
  title: "Finance dashboard",
};

export default async function FinanceDashboardPage() {
  const model = await loadDashboardFinancePage();
  return <FinanceDashboardPanel model={model} />;
}
