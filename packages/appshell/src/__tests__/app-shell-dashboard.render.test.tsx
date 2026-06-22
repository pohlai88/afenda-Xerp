import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationShellDashboardDemo } from "../dashboard";

describe("ApplicationShellDashboardDemo", () => {
  it("renders governed ERP dashboard surfaces without TIP-004 violations", () => {
    render(<ApplicationShellDashboardDemo />);

    expect(
      screen.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeInTheDocument();
    expect(screen.getByText("Revenue this month")).toBeInTheDocument();
    expect(screen.getByText("Revenue growth")).toBeInTheDocument();
    expect(screen.getByText("Generated leads")).toBeInTheDocument();
    expect(screen.getByText("3 active modules")).toBeInTheDocument();
    expect(screen.getByText("4 active regions")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Gross revenue")).toBeInTheDocument();
    expect(screen.getByText("Total revenue")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create invoice" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Accounts receivable" })).toBeInTheDocument();
  });
});
