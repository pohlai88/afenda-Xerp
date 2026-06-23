import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShellActivityDialog } from "../shadcn-studio/blocks/app-shell-activity-dialog";

describe("AppShellActivityDialog", () => {
  it("renders the trigger without TIP-004 consumer violations", () => {
    render(
      <AppShellActivityDialog
        trigger={<button type="button">Open activity</button>}
      />
    );

    expect(
      screen.getByRole("button", { name: "Open activity" })
    ).toBeInTheDocument();
  });

  it("renders sheet chrome and feed when open", () => {
    render(
      <AppShellActivityDialog
        defaultOpen
        trigger={<button type="button">Open activity</button>}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Recent activity from your team across modules, approvals, and shared documents/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("feed", { name: "Team activity feed" })
    ).toBeInTheDocument();
    expect(document.querySelector(".app-shell-activity-panel")).not.toBeNull();
  });

  it("passes a custom feed label to the activity feed", () => {
    render(
      <AppShellActivityDialog
        defaultOpen
        feedLabel="Finance activity"
        trigger={<button type="button">Open activity</button>}
      />
    );

    expect(
      screen.getByRole("feed", { name: "Finance activity" })
    ).toBeInTheDocument();
  });
});
