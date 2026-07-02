"use client";

import { AppShell } from "../components-app-shell/resolve-shell.js";
import type { McpSeedBlockId } from "../meta-registry/mcp-seed-block-manifest.js";
import { resolveStudioBlockComponent } from "../meta-registry/studio-block-component.registry.js";
import { ErpPresentationProviders } from "../theme/erp-presentation-providers.js";

/** Keep aligned with apps/erp/src/lib/workspace/dashboard-default-layout.preset.ts */
export type StorybookDashboardLayoutItem = {
  readonly h: number;
  readonly i: string;
  readonly w: number;
  readonly x: number;
  readonly y: number;
};

export type StorybookDashboardLayoutPreset = {
  readonly columns: number;
  readonly items: readonly StorybookDashboardLayoutItem[];
  readonly rowHeight: number;
  readonly version: number;
};

export const STORYBOOK_TIER_A_V1_WIDGET_IDS = [
  "kpi-net-income",
  "revenue-chart",
  "statistics-line-trends",
  "payment-history",
  "recent-transactions",
  "invoice-table",
] as const;

export type StorybookTierAV1WidgetId =
  (typeof STORYBOOK_TIER_A_V1_WIDGET_IDS)[number];

/** Mirror of ERP dashboard-widget-bridge Tier A v1 block ids. */
export const STORYBOOK_TIER_A_V1_WIDGET_BLOCK_MAP = {
  "invoice-table": "datatable-invoice",
  "kpi-net-income": "statistics-card-01",
  "payment-history": "widget-payment-history",
  "recent-transactions": "widget-transactions",
  "revenue-chart": "chart-sales-metrics",
  "statistics-line-trends": "statistics-line-trends-card",
} as const satisfies Record<StorybookTierAV1WidgetId, McpSeedBlockId>;

function layoutItem(
  widgetId: StorybookTierAV1WidgetId,
  placement: Pick<StorybookDashboardLayoutItem, "h" | "w" | "x" | "y">
): StorybookDashboardLayoutItem {
  return {
    h: placement.h,
    i: widgetId,
    w: placement.w,
    x: placement.x,
    y: placement.y,
  };
}

export const STORYBOOK_TIER_A_V1_LAYOUT_PRESET = {
  columns: 12,
  items: [
    layoutItem("kpi-net-income", { x: 0, y: 0, w: 4, h: 2 }),
    layoutItem("statistics-line-trends", { x: 4, y: 0, w: 4, h: 2 }),
    layoutItem("revenue-chart", { x: 8, y: 0, w: 4, h: 3 }),
    layoutItem("payment-history", { x: 0, y: 2, w: 4, h: 3 }),
    layoutItem("recent-transactions", { x: 4, y: 2, w: 4, h: 3 }),
    layoutItem("invoice-table", { x: 0, y: 5, w: 12, h: 4 }),
  ],
  rowHeight: 80,
  version: 1,
} as const satisfies StorybookDashboardLayoutPreset;

const ERP_WORKSPACE_NAV_GROUPS = [
  {
    label: "Platform",
    items: [
      {
        href: "/workspace",
        isActive: true,
        label: "Workspace",
      },
    ],
  },
  {
    label: "System Admin",
    items: [
      { href: "/system-admin/users", label: "Users" },
      { href: "/system-admin/roles", label: "Roles" },
    ],
  },
] as const;

const ERP_WORKSPACE_OPERATING_CONTEXT = {
  legalEntityLabel: "Acme US LLC",
  tenantLabel: "Acme Holdings",
  workspaceLabel: "Acme US LLC · Operations",
} as const;

export const ERP_WORKSPACE_DASHBOARD_PAGE_COPY = {
  page: {
    contentLabel: "Workspace dashboard",
    description: "Overview widgets filtered by your workspace permissions.",
    title: "Workspace home",
  },
  pageTitleId: "workspace-home-page-title",
} as const;

function resolveStorybookWidgetBlockId(
  widgetId: string
): McpSeedBlockId | undefined {
  if (!(widgetId in STORYBOOK_TIER_A_V1_WIDGET_BLOCK_MAP)) {
    return;
  }

  return STORYBOOK_TIER_A_V1_WIDGET_BLOCK_MAP[
    widgetId as StorybookTierAV1WidgetId
  ];
}

export interface StorybookDashboardLayoutRendererProps {
  readonly layout: StorybookDashboardLayoutPreset;
}

export function StorybookDashboardLayoutRenderer({
  layout,
}: StorybookDashboardLayoutRendererProps) {
  return (
    <section
      aria-label="Workspace dashboard grid"
      className="grid gap-4"
      style={{
        gridAutoRows: `${layout.rowHeight}px`,
        gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
      }}
    >
      {layout.items.map((item) => {
        const blockId = resolveStorybookWidgetBlockId(item.i);

        if (blockId === undefined) {
          return null;
        }

        const Block = resolveStudioBlockComponent(blockId);

        if (Block === undefined) {
          return null;
        }

        return (
          <div
            className="min-h-0"
            data-testid={`workspace-widget-${item.i}`}
            key={item.i}
            style={{
              gridColumn: `${item.x + 1} / span ${item.w}`,
              gridRow: `${item.y + 1} / span ${item.h}`,
            }}
          >
            <Block />
          </div>
        );
      })}
    </section>
  );
}

export interface ErpWorkspaceDashboardPageSampleProps {
  readonly shellClassName?: string;
}

export function ErpWorkspaceDashboardPageSample({
  shellClassName,
}: ErpWorkspaceDashboardPageSampleProps) {
  return (
    <div className={shellClassName ?? "min-h-svh bg-background"}>
      <ErpPresentationProviders>
        <AppShell
          navGroups={ERP_WORKSPACE_NAV_GROUPS}
          operatingContext={ERP_WORKSPACE_OPERATING_CONTEXT}
        >
          <section
            aria-labelledby={ERP_WORKSPACE_DASHBOARD_PAGE_COPY.pageTitleId}
            className="flex flex-col gap-6 p-6"
          >
            <header className="flex flex-col gap-2">
              <h1
                className="font-semibold text-2xl"
                id={ERP_WORKSPACE_DASHBOARD_PAGE_COPY.pageTitleId}
              >
                {ERP_WORKSPACE_DASHBOARD_PAGE_COPY.page.title}
              </h1>
              <p className="text-muted-foreground text-sm">
                {ERP_WORKSPACE_DASHBOARD_PAGE_COPY.page.description}
              </p>
            </header>
            <StorybookDashboardLayoutRenderer
              layout={STORYBOOK_TIER_A_V1_LAYOUT_PRESET}
            />
          </section>
        </AppShell>
      </ErpPresentationProviders>
    </div>
  );
}
