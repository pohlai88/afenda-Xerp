import { financeDashboardFixtures } from "./fixtures/dashboard-finance.fixtures";

export interface DashboardFinancePageModel {
  readonly page: typeof financeDashboardFixtures;
}

export function loadDashboardFinancePage(): DashboardFinancePageModel {
  return {
    page: financeDashboardFixtures,
  };
}
