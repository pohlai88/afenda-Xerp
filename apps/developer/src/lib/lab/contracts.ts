import type { AppShellOperatingContextWire } from "@afenda/shadcn-studio-v2";

export interface LabUserRow {
  readonly avatar: string;
  readonly billing: string;
  readonly email: string;
  readonly fallback: string;
  readonly id: string;
  readonly plan: string;
  readonly role: string;
  readonly status: string;
  readonly user: string;
}

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
  users: readonly LabUserRow[];
}

export interface AppearanceSettingsPageData extends LabRoutePresentationData {
  description: string;
  guidelines: readonly {
    summary: string;
    title: string;
  }[];
  promotion: LabPromotionNote;
  promotionSummary: string;
  reviewNote: string | null;
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

export interface IntegrationGraphNodeWire {
  readonly id: string;
  readonly label: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly type: string;
}

export interface IntegrationGraphEdgeWire {
  readonly source: string;
  readonly target: string;
  readonly type: string;
}

export interface IntegrationGraphSliceWire {
  readonly id: string;
  readonly priority: string;
  readonly status: "delivered" | "in-progress" | "planned";
  readonly summary: string;
}

export interface IntegrationGraphSnapshotWire {
  readonly edges: readonly IntegrationGraphEdgeWire[];
  readonly fingerprint: string;
  readonly generatedAt: string;
  readonly nodes: readonly IntegrationGraphNodeWire[];
  readonly slices: readonly IntegrationGraphSliceWire[];
  readonly version: string;
}

export interface IntegrationPostureGapWire {
  readonly advice: string;
  readonly current: string;
  readonly id: string;
  readonly nodeIds: readonly string[];
  readonly severity: "high" | "medium";
  readonly sliceId: string;
  readonly target: string;
}

export interface IntegrationPostureCountsWire {
  readonly gaps: number;
  readonly labRoutes: number;
  readonly moduleSurfaces: number;
  readonly slicesDelivered: number;
}

export interface IntegrationPostureWire {
  readonly counts: IntegrationPostureCountsWire;
  readonly gaps: readonly IntegrationPostureGapWire[];
}

export interface ArchitectureMapPageData extends LabRoutePresentationData {
  readonly description: string;
  readonly generatedAtLabel: string;
  readonly graph: IntegrationGraphSnapshotWire;
  readonly posture: IntegrationPostureWire;
  readonly promotion: LabPromotionNote;
  readonly promotionSummary: string;
  readonly slices: readonly IntegrationGraphSliceWire[];
  readonly targetIngressMermaid: string;
  readonly title: string;
}
