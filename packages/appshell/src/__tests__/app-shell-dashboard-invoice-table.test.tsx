import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShellDashboardInvoiceTable } from "../presentation/blocks/app-shell-dashboard-invoice-table";

describe("AppShellDashboardInvoiceTable", () => {
  it("renders invoice ledger region with summary metrics", () => {
    render(<AppShellDashboardInvoiceTable />);

    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getByText("Accounts receivable")).toBeInTheDocument();
    expect(screen.getByText(/Outstanding/i)).toBeInTheDocument();
  });

  it("renders source-empty copy and create action", () => {
    render(<AppShellDashboardInvoiceTable rows={[]} />);

    expect(screen.getByText("No invoices yet")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Create invoice/i }).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("labels pagination page buttons for screen readers", () => {
    render(<AppShellDashboardInvoiceTable />);

    expect(
      screen.getByRole("button", { name: "Go to page 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to page 2" })
    ).toBeInTheDocument();
  });
});
