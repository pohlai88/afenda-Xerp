/**
 * PAS-005A B42p — serializable delegating-flip policy for presentation MCP wrappers.
 * Documents why governed-compose entries cannot flip and which delegating entries are safe.
 */

import { PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY } from "./presentation-mcp-account-settings-content.registry";
import { PRESENTATION_MCP_RESIDUAL_REGISTRY } from "./presentation-mcp-residual.registry";
import {
  computePresentationMcpWrapperSummary,
  PRESENTATION_MCP_WRAPPER_REGISTRY,
} from "./presentation-mcp-wrapper.registry";
import type {
  PresentationMcpWrapperEntry,
  PresentationMcpWrapperStatus,
} from "./presentation-mcp-wrapper.types";

export type DelegatingFlipRationale =
  | "mcp-a11y-parity"
  | "erp-injection-slots"
  | "dashboard-a11y-landmarks"
  | "shell-chrome-governed"
  | "afenda-domain-shell";

export interface PresentationMcpDelegatingFlipPolicyEntry {
  readonly currentStatus: PresentationMcpWrapperStatus;
  readonly flipBlockedBy?: readonly string[];
  readonly publicExportName: string;
  readonly rationale: DelegatingFlipRationale;
  readonly targetStatus: "delegating" | "governed-compose" | "afenda-only";
}

interface PresentationMcpDelegatingFlipPolicyMetadata {
  readonly flipBlockedBy?: readonly string[];
  readonly rationale: DelegatingFlipRationale;
}

const DELEGATING_FLIP_POLICY_BY_EXPORT = {
  StatisticsRevenueCard: { rationale: "mcp-a11y-parity" },
  StatisticsActivityCard: { rationale: "mcp-a11y-parity" },
  StatisticsLeadsCard: { rationale: "mcp-a11y-parity" },
  StatisticsProfileTrafficCard: { rationale: "mcp-a11y-parity" },
  AppShellPresentationHeroSection01: { rationale: "shell-chrome-governed" },
  AppShellPresentationStatisticsOrdersProgressCard: {
    rationale: "shell-chrome-governed",
  },
  AppShellPresentationStatisticsSalesOverviewCard: {
    rationale: "shell-chrome-governed",
  },
  AppShellPresentationChartEarningReport: {
    rationale: "shell-chrome-governed",
  },
  StatisticsLineTrendsCard: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: [
      "app-shell-statistics-metric-cards.test.tsx",
      "dashboard-block.stories.test.tsx",
    ],
  },
  AppShellMenuTrigger: {
    rationale: "erp-injection-slots",
    flipBlockedBy: ["app-shell-menu-trigger.test.tsx"],
  },
  AppShellSidebarUserDropdown: {
    rationale: "erp-injection-slots",
    flipBlockedBy: ["app-shell-sidebar-user-dropdown.test.tsx"],
  },
  AppShellDashboardStatisticsMetrics: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: [
      "app-shell-statistics-metric-cards.test.tsx",
      "dashboard-block.stories.test.tsx",
    ],
  },
  AppShellDashboardStatisticsLineTrends: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: [
      "app-shell-statistics-metric-cards.test.tsx",
      "dashboard-block.stories.test.tsx",
    ],
  },
  AppShellDashboardRevenueChart: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: [
      "app-shell-dashboard-chart-a11y.test.tsx",
      "dashboard-block.stories.test.tsx",
    ],
  },
  AppShellDashboardModuleEarnings: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: ["app-shell-dashboard-module-earnings.test.tsx"],
  },
  AppShellDashboardRegionalSales: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: ["app-shell-dashboard-regional-sales.test.ts"],
  },
  AppShellDashboardRecentTransactions: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: ["dashboard-block.stories.test.tsx"],
  },
  AppShellDashboardPaymentHistory: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: ["dashboard-block.stories.test.tsx"],
  },
  AppShellDashboardInvoiceTable: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: [
      "app-shell-dashboard-invoice-table.test.tsx",
      "app-shell-dashboard-invoice-table.columns.test.tsx",
    ],
  },
  AppShellDashboardStatisticsIncomeCard: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: ["dashboard-block.stories.test.tsx"],
  },
  AppShellDashboardStatisticsExpenseCard: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: ["dashboard-block.stories.test.tsx"],
  },
  AppShellSearchDialog: {
    rationale: "shell-chrome-governed",
    flipBlockedBy: ["app-shell-search-dialog.test.tsx"],
  },
  AppShellNotificationDropdown: {
    rationale: "shell-chrome-governed",
    flipBlockedBy: ["app-shell-notification-dropdown.test.tsx"],
  },
  AppShellLanguageDropdown: {
    rationale: "shell-chrome-governed",
    flipBlockedBy: ["app-shell-language-dropdown.test.tsx"],
  },
  AppShellProfileDropdown: {
    rationale: "shell-chrome-governed",
    flipBlockedBy: ["app-shell-profile-dropdown.test.tsx"],
  },
  AppShellActivityDialog: {
    rationale: "shell-chrome-governed",
    flipBlockedBy: ["app-shell-activity-dialog.test.tsx"],
  },
  AppShellDashboardKpiStat: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: ["app-shell-dashboard-kpi-stat.test.tsx"],
  },
  AppShellDashboardSparklineStat: {
    rationale: "dashboard-a11y-landmarks",
    flipBlockedBy: [
      "app-shell-dashboard-chart-a11y.test.tsx",
      "app-shell-dashboard-sparkline-stat.test.ts",
    ],
  },
  SystemAdminReadinessGateMetrics: {
    rationale: "erp-injection-slots",
    flipBlockedBy: ["system-admin-readiness-gate-metrics.test.tsx"],
  },
  AppShellContextSwitcher: { rationale: "erp-injection-slots" },
  AppShellModuleWorkspaceChrome: { rationale: "erp-injection-slots" },
} as const satisfies Record<
  string,
  PresentationMcpDelegatingFlipPolicyMetadata
>;

const AFENDA_ONLY_DEFAULT_RATIONALE = "afenda-domain-shell" as const;

function resolvePolicyMetadata(
  entry: PresentationMcpWrapperEntry
): PresentationMcpDelegatingFlipPolicyMetadata {
  const explicit =
    DELEGATING_FLIP_POLICY_BY_EXPORT[
      entry.publicExportName as keyof typeof DELEGATING_FLIP_POLICY_BY_EXPORT
    ];

  if (explicit !== undefined) {
    return explicit;
  }

  if (entry.status === "afenda-only") {
    return { rationale: AFENDA_ONLY_DEFAULT_RATIONALE };
  }

  throw new Error(
    `presentation-mcp-delegating-flip-policy: missing metadata for ${entry.publicExportName}`
  );
}

function toPolicyEntry(
  entry: PresentationMcpWrapperEntry
): PresentationMcpDelegatingFlipPolicyEntry {
  const metadata = resolvePolicyMetadata(entry);

  return {
    publicExportName: entry.publicExportName,
    currentStatus: entry.status,
    targetStatus: entry.status,
    rationale: metadata.rationale,
    ...(metadata.flipBlockedBy === undefined
      ? {}
      : { flipBlockedBy: metadata.flipBlockedBy }),
  };
}

export const ALL_PRESENTATION_MCP_WRAPPER_ENTRIES = [
  ...PRESENTATION_MCP_WRAPPER_REGISTRY,
  ...PRESENTATION_MCP_ACCOUNT_SETTINGS_CONTENT_REGISTRY,
  ...PRESENTATION_MCP_RESIDUAL_REGISTRY,
] as const satisfies readonly PresentationMcpWrapperEntry[];

export const PRESENTATION_MCP_DELEGATING_FLIP_POLICY_REGISTRY =
  ALL_PRESENTATION_MCP_WRAPPER_ENTRIES.map(toPolicyEntry);

export function listDelegatingFlipPolicyEntries(
  registry: readonly PresentationMcpDelegatingFlipPolicyEntry[] = PRESENTATION_MCP_DELEGATING_FLIP_POLICY_REGISTRY
): readonly PresentationMcpDelegatingFlipPolicyEntry[] {
  return registry.filter((entry) => entry.currentStatus === "delegating");
}

export function listGovernedComposeFlipPolicyEntries(
  registry: readonly PresentationMcpDelegatingFlipPolicyEntry[] = PRESENTATION_MCP_DELEGATING_FLIP_POLICY_REGISTRY
): readonly PresentationMcpDelegatingFlipPolicyEntry[] {
  return registry.filter((entry) => entry.currentStatus === "governed-compose");
}

export function computeDelegatingFlipPolicySummary(
  registry: readonly PresentationMcpDelegatingFlipPolicyEntry[] = PRESENTATION_MCP_DELEGATING_FLIP_POLICY_REGISTRY
): {
  readonly delegatingCount: number;
  readonly entryCount: number;
  readonly governedComposeCount: number;
  readonly afendaOnlyCount: number;
} {
  return {
    entryCount: registry.length,
    delegatingCount: registry.filter(
      (entry) => entry.currentStatus === "delegating"
    ).length,
    governedComposeCount: registry.filter(
      (entry) => entry.currentStatus === "governed-compose"
    ).length,
    afendaOnlyCount: registry.filter(
      (entry) => entry.currentStatus === "afenda-only"
    ).length,
  };
}

/** Delegating count on the main strangler registry — policy tests sync against this. */
export function getMainRegistryDelegatingCount(): number {
  return computePresentationMcpWrapperSummary().delegatingCount;
}
