import type {
  AppShellOperatingContextWire,
  DatatableUserRow,
} from "@afenda/shadcn-studio";

export type LabRouteLoader<TPageData, TParams = never> = [TParams] extends [
  never,
]
  ? () => Promise<TPageData>
  : (params: TParams) => Promise<TPageData>;

export interface LabPromotionNote {
  futureDataSource: "domain-loader" | "internal-bff" | "server-action";
  futureErpPath: string;
  notes: string;
}

export interface LabRoutePreviewImage {
  alt: string;
  height: number;
  src: string;
  width: number;
}

export interface LabRoutePresentationData {
  canonicalHref: string;
  previewImage: LabRoutePreviewImage;
}

export interface SalesDashboardPageData extends LabRoutePresentationData {
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

export interface FinanceDashboardPageData extends LabRoutePresentationData {
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

export interface AdminUsersPageData extends LabRoutePresentationData {
  description: string;
  promotion: LabPromotionNote;
  promotionSummary: string;
  title: string;
  users: readonly DatatableUserRow[];
}

export interface AppearanceSettingsPageData extends LabRoutePresentationData {
  description: string;
  guidelines: readonly {
    summary: string;
    title: string;
  }[];
  promotion: LabPromotionNote;
  promotionSummary: string;
  title: string;
}

export interface ModuleDocumentRouteParams {
  documentId: string;
  moduleSlug: string;
  surface: string;
}

export type ModuleDocumentRouteState =
  | "empty"
  | "not-found"
  | "ready"
  | "restricted";

export interface ModuleDocumentPageData {
  canonicalHref: string;
  description: string;
  documentFacts: readonly {
    label: string;
    value: string;
  }[];
  documentLabel: string;
  moduleLabel: string;
  previewImage: {
    alt: string;
    height: number;
    src: string;
    width: number;
  };
  promotion: LabPromotionNote;
  promotionSummary: string;
  routeSummary: string;
  state: Exclude<ModuleDocumentRouteState, "not-found">;
  stateSummary: string;
  surfaceLabel: string;
  title: string;
  verificationChecklist: readonly {
    summary: string;
    title: string;
  }[];
}

export type ModuleDocumentRouteLoadResult =
  | {
      status: "not-found";
    }
  | {
      pageData: ModuleDocumentPageData;
      status: Exclude<ModuleDocumentRouteState, "not-found">;
    };

export type LabDemoContext = AppShellOperatingContextWire;
