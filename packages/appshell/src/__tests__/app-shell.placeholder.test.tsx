import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_APP_SHELL_DASHBOARD_LABEL,
} from "../shadcn-studio/data/app-shell.dashboard.data";
import {
  DEFAULT_APP_SHELL_PLACEHOLDER_DASHBOARD_LABEL,
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE,
  defaultAppShellPlaceholderKpiCards,
  defaultAppShellPlaceholderOrders,
} from "../shadcn-studio/data/app-shell.placeholder.data";
import { ApplicationShellPlaceholderContent } from "../app-shell.placeholder";

describe("ApplicationShellPlaceholderContent", () => {
  it("renders the ERP overview dashboard without TIP-004 consumer violations", () => {
    render(<ApplicationShellPlaceholderContent />);

    expect(
      screen.getByRole("region", { name: DEFAULT_APP_SHELL_PLACEHOLDER_DASHBOARD_LABEL })
    ).toBeInTheDocument();
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Net Income")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE })
    ).toBeInTheDocument();
  });

  it("renders sparkline change values as plain secondary text", () => {
    render(<ApplicationShellPlaceholderContent />);

    const revenueChange = screen.getByText("+14.2%");
    expect(revenueChange).toHaveClass("app-shell-placeholder-sparkline-change");
    expect(revenueChange.closest("[data-slot='badge']")).toBeNull();
  });

  it("renders KPI badges with governed data-slot values", () => {
    render(<ApplicationShellPlaceholderContent />);

    const liveBadge = screen.getByText("Live");
    expect(liveBadge.closest("[data-slot='badge']")).not.toBeNull();
  });

  it("exposes sparkline charts as labelled images", () => {
    render(<ApplicationShellPlaceholderContent />);

    expect(screen.getByRole("img", { name: "Total Revenue sparkline trend" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Operating Expenses sparkline trend" })
    ).toBeInTheDocument();
  });

  it("renders module progress bars with accessible values", () => {
    render(<ApplicationShellPlaceholderContent />);

    const financeProgress = screen.getByRole("progressbar", {
      name: "Finance progress: 82%",
    });
    expect(financeProgress).toHaveAttribute("aria-valuenow", "82");
    expect(financeProgress.className).toContain("app-shell-placeholder-progress-fill-high");
  });

  it("renders recent orders as an accessible list", () => {
    render(<ApplicationShellPlaceholderContent />);

    const ordersHeading = screen.getByRole("heading", {
      name: DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE,
    });
    const ordersSection = ordersHeading.closest("section");
    expect(ordersSection).not.toBeNull();

    const orderItems = within(ordersSection as HTMLElement).getAllByRole("listitem");
    expect(orderItems).toHaveLength(defaultAppShellPlaceholderOrders.length);
    expect(
      within(ordersSection as HTMLElement).getByRole("listitem", {
        name: "AP Invoice #8821, Finance",
      })
    ).toBeInTheDocument();
  });

  it("accepts custom dashboard data overrides", () => {
    const [sampleKpiCard] = defaultAppShellPlaceholderKpiCards;
    const [sampleOrder] = defaultAppShellPlaceholderOrders;
    if (sampleKpiCard === undefined || sampleOrder === undefined) {
      throw new Error("Expected placeholder fixtures.");
    }

    render(
      <ApplicationShellPlaceholderContent
        dashboardLabel="Custom dashboard"
        kpiCards={[
          {
            id: "custom-kpi",
            title: "Custom KPI",
            badge: "Demo",
            value: "100",
            trend: "up",
            Icon: sampleKpiCard.Icon,
          },
        ]}
        modulePerformance={[
          {
            id: "custom-module",
            name: "Custom Module",
            status: "On Track",
            progress: 60,
          },
        ]}
        modulePerformanceTitle="Custom modules"
        modulePeriodLabel="Q3 demo"
        recentOrders={[
          {
            id: "custom-order",
            module: "Finance",
            description: "Custom order line",
            amount: "$500",
            type: "credit",
            Icon: sampleOrder.Icon,
          },
        ]}
        recentOrdersCaption="Latest entries"
        recentOrdersTitle="Custom orders"
        sparklineCards={[
          {
            id: "custom-sparkline",
            title: "Custom Revenue",
            amount: "$1,000",
            change: "+2%",
            trend: "up",
            data: [10, 20, 30],
          },
        ]}
        sparklineComparisonLabel="vs prior quarter"
      />
    );

    expect(screen.getByRole("region", { name: "Custom dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Custom KPI")).toBeInTheDocument();
    expect(screen.getByText("Custom Revenue")).toBeInTheDocument();
    expect(screen.getByText("vs prior quarter")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Custom orders" })).toBeInTheDocument();
    expect(screen.getByText("Latest entries")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Custom modules" })).toBeInTheDocument();
    expect(screen.getByText("Q3 demo")).toHaveAttribute("data-slot", "badge");
    expect(screen.getByText("Custom order line")).toBeInTheDocument();
    expect(screen.getByText("Custom Module")).toBeInTheDocument();
    expect(screen.queryByText("Net Income")).not.toBeInTheDocument();
  });

  it("mounts inside ApplicationShell as the default main content", async () => {
    const { ApplicationShell } = await import("../app-shell");

    render(<ApplicationShell />);

    const dashboard = screen.getByRole("region", {
      name: DEFAULT_APP_SHELL_DASHBOARD_LABEL,
    });
    expect(within(dashboard).getByText("Revenue this month")).toBeInTheDocument();
    expect(within(dashboard).getByText("Total revenue")).toBeInTheDocument();
    expect(
      within(dashboard).getByRole("progressbar", { name: "Finance progress: 82%" })
    ).toBeInTheDocument();
  });
});
