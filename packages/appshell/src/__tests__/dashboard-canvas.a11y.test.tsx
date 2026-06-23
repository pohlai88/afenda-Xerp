import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationShell } from "../app-shell";
import { ApplicationShellDashboardCanvas } from "../dashboard/app-shell-dashboard-canvas.client";

describe("ApplicationShell dashboard canvas accessibility", () => {
  it("exposes one main landmark in the shell", () => {
    render(
      <ApplicationShell>
        <p>Workspace body</p>
      </ApplicationShell>
    );

    expect(screen.getAllByRole("main")).toHaveLength(1);
  });

  it("labels drag handles in edit mode", () => {
    render(<ApplicationShellDashboardCanvas editMode />);

    expect(
      screen.getByRole("button", { name: "Drag Revenue this month" })
    ).toBeInTheDocument();
  });

  it("does not render drag handles in readonly mode", () => {
    render(<ApplicationShellDashboardCanvas editMode={false} />);

    expect(
      screen.queryByRole("button", { name: /^Drag / })
    ).not.toBeInTheDocument();
  });

  it("does not expose edit chrome in readonly mode", () => {
    render(<ApplicationShellDashboardCanvas editMode={false} />);

    expect(screen.queryByText("Edit mode")).not.toBeInTheDocument();
  });
});
