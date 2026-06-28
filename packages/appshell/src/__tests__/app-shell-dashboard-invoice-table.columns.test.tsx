import { TooltipProvider } from "@afenda/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createAppShellDashboardInvoiceColumns,
  formatInvoiceCurrency,
  formatIssuedDate,
  resolveInvoiceStatusLabelFromFilterValue,
} from "../presentation/blocks/app-shell-dashboard-invoice-table.columns";
import type { AppShellDashboardInvoiceRow } from "../presentation/data/app-shell.dashboard.types";
import { asAppShellInvoiceId } from "../presentation/data/app-shell.dashboard.types";

describe("app-shell-dashboard-invoice-table.columns", () => {
  it("formats invoice currency and issued dates", () => {
    expect(formatInvoiceCurrency(1250.5)).toBe("$1,250.50");
    expect(formatIssuedDate(new Date("2026-03-15T12:00:00Z"))).toMatch(
      /Mar 15, 2026/
    );
  });

  it("maps filter values to invoice status labels", () => {
    expect(resolveInvoiceStatusLabelFromFilterValue("past_due")).toBe(
      "Past due"
    );
    expect(resolveInvoiceStatusLabelFromFilterValue("custom")).toBe("custom");
  });

  it("renders status cells with dot + text and data-status markers", () => {
    const statusColumn = createAppShellDashboardInvoiceColumns().find(
      (
        column
      ): column is ColumnDef<AppShellDashboardInvoiceRow, unknown> & {
        accessorKey: "status";
      } => "accessorKey" in column && column.accessorKey === "status"
    );
    expect(statusColumn?.cell).toBeDefined();
    if (
      statusColumn?.cell === undefined ||
      typeof statusColumn.cell !== "function"
    ) {
      throw new Error("Expected status column cell renderer.");
    }

    render(
      <TooltipProvider>
        {statusColumn.cell({
          row: {
            original: {
              id: asAppShellInvoiceId("INV-1001"),
              status: { kind: "past_due" },
              avatarSrc: "https://example.com/a.jpg",
              avatarFallback: "AC",
              client: "Acme Corp",
              field: "Accounts receivable",
              total: 1200,
              issuedDate: new Date("2026-03-15T12:00:00Z"),
              balance: 1200,
            },
            getValue: () => "past_due",
          },
        } as never)}
      </TooltipProvider>
    );

    expect(
      screen.getByRole("button", { name: /Past due\./ })
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.app-shell-studio-invoice-status-dot[data-status="past_due"]'
      )
    ).not.toBeNull();
    expect(screen.getByText("Past due")).toBeInTheDocument();
  });
});
