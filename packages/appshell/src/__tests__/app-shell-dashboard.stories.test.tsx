import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as dashboardStories from "../app-shell-dashboard.stories";
import * as canvasStories from "../app-shell-dashboard-canvas.stories";

const { Default, FinanceGated, EmptyInvoices, EmptyRegionalSales } =
  composeStories(dashboardStories);
const { WidgetsOnly: CanvasWidgetsOnly } = composeStories(canvasStories);

describe("ApplicationShell dashboard stories (portable CSF)", () => {
  it("Default renders the governed dashboard region with individual metric widgets", () => {
    const { container } = render(<Default />);

    expect(
      screen.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeInTheDocument();
    expect(screen.getByText("Revenue this month")).toBeInTheDocument();
    expect(screen.getByText("Net income")).toBeInTheDocument();
    expect(
      container.querySelector(".app-shell-kpi-grid")
    ).not.toBeInTheDocument();
    expect(
      container.querySelector(".app-shell-sparkline-grid")
    ).not.toBeInTheDocument();
  });

  it("FinanceGated hides finance-gated widgets from the canvas", () => {
    render(<FinanceGated />);

    expect(screen.getByText("Module revenue")).toBeInTheDocument();
    expect(screen.queryByText("Accounts receivable")).not.toBeInTheDocument();
  });

  it("EmptyInvoices renders the governed empty state", () => {
    render(<EmptyInvoices />);

    expect(screen.getByText("Accounts receivable")).toBeInTheDocument();
    expect(screen.getByText(/No invoices yet/i)).toBeInTheDocument();
  });

  it("EmptyRegionalSales renders the governed empty state", () => {
    render(<EmptyRegionalSales />);

    expect(screen.getByText("Revenue by region")).toBeInTheDocument();
    expect(screen.getByText(/No regional revenue yet/i)).toBeInTheDocument();
  });

  it("Canvas WidgetsOnly exposes per-widget grid cells in edit mode", () => {
    const { container } = render(<CanvasWidgetsOnly />);

    expect(
      screen.getByRole("button", { name: "Drag Revenue this month" })
    ).toBeInTheDocument();
    expect(
      container.querySelectorAll("[data-dashboard-widget]").length
    ).toBeGreaterThan(10);
  });
});
