import "@testing-library/jest-dom/vitest";
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sidebar, SidebarProvider, SidebarTrigger } from "./sidebar";
import { SIDEBAR_SLOTS } from "./sidebar.contract";

describe("sidebar interaction", () => {
  it("renders governed wrapper and root slots with SidebarProvider and Sidebar", () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <div>Nav content</div>
        </Sidebar>
      </SidebarProvider>
    );

    expect(
      document.querySelector(`[data-slot="${SIDEBAR_SLOTS.wrapper}"]`)
    ).toBeInTheDocument();
    expect(
      document.querySelector(`[data-slot="${SIDEBAR_SLOTS.root}"]`)
    ).toBeInTheDocument();
    expect(screen.getByText("Nav content")).toBeInTheDocument();
  });

  it("toggles data-state on sidebar root when SidebarTrigger is clicked", async () => {
    const user = setupUser();

    render(
      <SidebarProvider defaultOpen>
        <Sidebar>
          <div>Nav content</div>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    );

    const sidebarRoot = document.querySelector(
      `[data-slot="${SIDEBAR_SLOTS.root}"][data-state]`
    );
    expect(sidebarRoot).toHaveAttribute("data-state", "expanded");

    await user.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(sidebarRoot).toHaveAttribute("data-state", "collapsed");

    await user.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(sidebarRoot).toHaveAttribute("data-state", "expanded");
  });
});
