import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationShellDashboardContent } from "../app-shell-dashboard";

describe("ApplicationShellDashboardContent", () => {
  it("renders governed ERP dashboard surfaces without TIP-004 violations", { timeout: 15000 }, () => {
    render(<ApplicationShellDashboardContent showLegacyWidgets={false} />);

    expect(
      screen.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeInTheDocument();
    expect(screen.getByText("Revenue this month")).toBeInTheDocument();
    expect(screen.getByText("Total revenue")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create invoice" })).toBeInTheDocument();
  });
});
