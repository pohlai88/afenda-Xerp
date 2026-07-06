"use client";

import { AppShell01 } from "../components/layout/appshell-01";
import type { AppShellNavGroupWire } from "../types/app-shell";
import { EvidenceWidget } from "../views/widgets/widget-evidence";
import { MetricWidget } from "../views/widgets/widget-metric";

/** Stable widget ids for Storybook smoke — v2 adapters replace v1 MCP block grid. */
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
  version: 2,
} as const satisfies StorybookDashboardLayoutPreset;

const ERP_WORKSPACE_NAV_GROUPS = [
  {
    id: "platform",
    label: "Platform",
    items: [
      {
        href: "/workspace",
        id: "workspace",
        isActive: true,
        label: "Workspace",
      },
    ],
  },
  {
    id: "system-admin",
    label: "System Admin",
    items: [
      { href: "/system-admin/users", id: "users", label: "Users" },
      { href: "/system-admin/roles", id: "roles", label: "Roles" },
    ],
  },
] as const satisfies readonly AppShellNavGroupWire[];

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

function renderStorybookWorkspaceWidget(widgetId: StorybookTierAV1WidgetId) {
  switch (widgetId) {
    case "kpi-net-income":
      return (
        <MetricWidget label="Net income" state="ready" value="128,400" />
      );
    case "revenue-chart":
      return <MetricWidget label="Revenue" state="ready" value="$2.4M" />;
    case "statistics-line-trends":
      return (
        <MetricWidget label="Line trends" state="ready" tone="success" value="+12%" />
      );
    case "payment-history":
      return (
        <EvidenceWidget
          items={[
            { id: "p1", label: "ACH settlement", status: "complete" },
            { id: "p2", label: "Card capture", status: "pending" },
          ]}
          label="Payment history"
          state="ready"
          summary={2}
        />
      );
    case "recent-transactions":
      return (
        <EvidenceWidget
          items={[
            { id: "t1", label: "INV-1042", status: "complete" },
            { id: "t2", label: "INV-1041", status: "complete" },
          ]}
          label="Recent transactions"
          state="ready"
          summary={2}
        />
      );
    case "invoice-table":
      return (
        <EvidenceWidget
          items={[
            { id: "i1", label: "Open invoices", status: "pending" },
            { id: "i2", label: "Overdue invoices", status: "missing" },
          ]}
          label="Invoice table"
          state="ready"
          summary={14}
        />
      );
    default: {
      const exhaustiveCheck: never = widgetId;
      return exhaustiveCheck;
    }
  }
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
        if (
          !STORYBOOK_TIER_A_V1_WIDGET_IDS.includes(
            item.i as StorybookTierAV1WidgetId
          )
        ) {
          return null;
        }

        const widgetId = item.i as StorybookTierAV1WidgetId;

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
            {renderStorybookWorkspaceWidget(widgetId)}
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
      <AppShell01
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
      </AppShell01>
    </div>
  );
}
