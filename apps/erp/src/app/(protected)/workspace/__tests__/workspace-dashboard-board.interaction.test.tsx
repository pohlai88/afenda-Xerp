// @vitest-environment jsdom

import { render, screen, setupUser } from "@afenda/testing/react";
import { describe, expect, it, vi } from "vitest";

import { DASHBOARD_DEFAULT_LAYOUT_PRESET } from "@/lib/workspace/dashboard-default-layout.preset";

import { WorkspaceDashboardBoard } from "@/app/(protected)/workspace/_components/workspace-dashboard-board.client";

vi.mock("@/components/workspace/workspace-board-canvas.client", () => ({
  WorkspaceBoardCanvasClient: ({
    editable,
  }: {
    readonly editable: boolean;
  }) => (
    <div data-testid="workspace-board-canvas" data-editable={String(editable)} />
  ),
}));

describe("WorkspaceDashboardBoard interaction", () => {
  it("toggles edit mode from the toolbar when layout editing is allowed", async () => {
    const user = setupUser();

    render(
      <WorkspaceDashboardBoard
        canEditLayout
        initialLayout={DASHBOARD_DEFAULT_LAYOUT_PRESET}
      />
    );

    expect(screen.getByTestId("workspace-board-canvas")).toHaveAttribute(
      "data-editable",
      "false"
    );

    await user.click(
      screen.getByRole("button", { name: "Edit dashboard layout" })
    );

    expect(screen.getByTestId("workspace-board-canvas")).toHaveAttribute(
      "data-editable",
      "true"
    );
    expect(
      screen.getByRole("button", { name: "Done editing layout" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps the board read-only when layout editing is locked", () => {
    render(
      <WorkspaceDashboardBoard
        canEditLayout={false}
        initialLayout={DASHBOARD_DEFAULT_LAYOUT_PRESET}
      />
    );

    expect(screen.getByTestId("workspace-board-canvas")).toHaveAttribute(
      "data-editable",
      "false"
    );
    expect(
      screen.getByRole("button", { name: "Layout edit locked" })
    ).toBeDisabled();
  });
});
