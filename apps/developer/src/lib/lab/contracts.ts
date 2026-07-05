import type {
  AppShellOperatingContextWire,
  DatatableUserRow,
} from "@afenda/shadcn-studio";

export type LabRouteLoader<TPageData> = () => Promise<TPageData>;

export interface LabPromotionNote {
  futureDataSource: "domain-loader" | "internal-bff" | "server-action";
  futureErpPath: string;
  notes: string;
}

export interface SalesDashboardPageData {
  description: string;
  overview: {
    changePercentage: string;
    deliveredSide: {
      count: string;
      label: string;
      percentage: string;
    };
    orderSide: {
      count: string;
      label: string;
      percentage: string;
    };
    progressValue: number;
    title: string;
    totalValue: string;
  };
  promotion: LabPromotionNote;
  promotionSummary: string;
  proof: {
    checklist: readonly {
      status: string;
      summary: string;
      title: string;
    }[];
    description: string;
    title: string;
  };
  revenue: {
    amount: string;
    changePercentage: number;
    chartData: readonly {
      day: string;
      revenue: number;
    }[];
    periodLabel: string;
    title: string;
  };
  title: string;
}

export interface FinanceDashboardPageData {
  description: string;
  focusAreas: readonly {
    summary: string;
    title: string;
  }[];
  promotion: LabPromotionNote;
  promotionSummary: string;
  revenue: SalesDashboardPageData["revenue"];
  title: string;
}

export interface AdminUsersPageData {
  description: string;
  promotion: LabPromotionNote;
  promotionSummary: string;
  title: string;
  users: readonly DatatableUserRow[];
}

export interface AppearanceSettingsPageData {
  description: string;
  guidelines: readonly {
    summary: string;
    title: string;
  }[];
  promotion: LabPromotionNote;
  title: string;
}

export type LabDemoContext = AppShellOperatingContextWire;
