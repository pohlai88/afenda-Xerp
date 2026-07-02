import { salesDashboardFixtures } from "./fixtures/dashboard-sales.fixtures";

export interface DashboardSalesPageModel {
  readonly page: typeof salesDashboardFixtures;
}

export function loadDashboardSalesPage(): DashboardSalesPageModel {
  return {
    page: salesDashboardFixtures,
  };
}
