// @vitest-environment jsdom

import { render, screen, setupUser } from "@afenda/testing/react";
import { describe, expect, it } from "vitest";

import { DASHBOARD_DEFAULT_LAYOUT_PRESET } from "@/lib/workspace/dashboard-default-layout.preset";

import { WorkspaceBoardCanvasClient } from "../workspace-board-canvas.client";
import { WORKSPACE_BOARD_DRAG_HANDLE_CLASS } from "../workspace-board-widget-frame.client";
import { toDashboardLayoutPreset } from "../workspace-board-layout.utils";

describe("WorkspaceBoardCanvasClient interaction", () => {
  it("shows drag handles only in editable mode", () => {
    const { rerender } = render(
      <WorkspaceBoardCanvasClient
        editable={false}
        layout={DASHBOARD_DEFAULT_LAYOUT_PRESET}
      />
    );

    expect(screen.queryByRole("button", { name: /drag handle/i })).toBeNull();

    rerender(
      <WorkspaceBoardCanvasClient
        editable
        layout={DASHBOARD_DEFAULT_LAYOUT_PRESET}
      />
    );

    expect(
      screen.getAllByRole("button", { name: /drag handle/i }).length
    ).toBeGreaterThan(0);
  });

  it("toggles aria-grabbed on drag handle via keyboard", async () => {
    const user = setupUser();

    render(
      <WorkspaceBoardCanvasClient
        editable
        layout={{
          columns: 12,
          items: [
            {
              h: 2,
              i: "kpi-net-income",
              w: 4,
              x: 0,
              y: 0,
            },
          ],
          rowHeight: 80,
          version: 1,
        }}
      />
    );

    const handle = screen.getByRole("button", {
      name: /drag handle for kpi net income/i,
    });

    handle.focus();
    await user.keyboard("{Enter}");

    expect(handle).toHaveAttribute("aria-grabbed", "true");

    await user.keyboard("{Escape}");

    expect(handle).toHaveAttribute("aria-grabbed", "false");
  });

  it("maps react-grid-layout deltas back to dashboard preset contract", () => {
    const next = toDashboardLayoutPreset(DASHBOARD_DEFAULT_LAYOUT_PRESET, [
      { h: 2, i: "kpi-net-income", w: 4, x: 1, y: 0 },
      { h: 2, i: "statistics-line-trends", w: 4, x: 5, y: 0 },
    ]);

    expect(next.items[0]).toMatchObject({
      i: "kpi-net-income",
      x: 1,
      y: 0,
    });
  });

  it("exposes drag handle class for react-grid-layout", () => {
    render(
      <WorkspaceBoardCanvasClient
        editable
        layout={{
          columns: 12,
          items: [
            {
              h: 2,
              i: "kpi-net-income",
              w: 4,
              x: 0,
              y: 0,
            },
          ],
          rowHeight: 80,
          version: 1,
        }}
      />
    );

    expect(document.querySelector(`.${WORKSPACE_BOARD_DRAG_HANDLE_CLASS}`)).not.toBeNull();
  });
});
