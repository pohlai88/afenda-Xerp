import { setupUser } from "@afenda/testing/react";
import { SidebarProvider } from "@afenda/ui";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AppShellMenuTriggerProps } from "../shadcn-studio/blocks/app-shell-menu-trigger";
import { AppShellMenuTrigger } from "../shadcn-studio/blocks/app-shell-menu-trigger";

function renderMenuTrigger(props?: AppShellMenuTriggerProps) {
  return render(
    <SidebarProvider>
      <AppShellMenuTrigger {...props} />
    </SidebarProvider>
  );
}

describe("AppShellMenuTrigger", () => {
  it("renders without TIP-004 consumer violations", () => {
    renderMenuTrigger();

    expect(
      screen.getByRole("button", { name: "Collapse sidebar" })
    ).toBeInTheDocument();
  });

  it("renders a governed button with sidebar trigger semantics", () => {
    renderMenuTrigger();

    const trigger = screen.getByRole("button", { name: "Collapse sidebar" });
    expect(trigger).toHaveAttribute("data-slot", "button");
    expect(trigger).toHaveAttribute("data-sidebar", "trigger");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles aria-expanded and the accessible label on click", async () => {
    const user = setupUser();
    renderMenuTrigger();

    const trigger = screen.getByRole("button", { name: "Collapse sidebar" });
    await user.click(trigger);

    const expandedTrigger = screen.getByRole("button", {
      name: "Expand sidebar",
    });
    expect(expandedTrigger).toHaveAttribute("aria-expanded", "false");

    await user.click(expandedTrigger);
    expect(
      screen.getByRole("button", { name: "Collapse sidebar" })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("supports a fixed toggle label override", () => {
    renderMenuTrigger({ toggleLabel: "Toggle navigation" });

    expect(
      screen.getByRole("button", { name: "Toggle navigation" })
    ).toBeInTheDocument();
  });

  it("supports a layout class on the plain HTML wrapper", () => {
    renderMenuTrigger({ className: "app-shell-menu-trigger" });

    const trigger = screen.getByRole("button", { name: "Collapse sidebar" });
    expect(trigger.parentElement).toHaveClass("app-shell-menu-trigger");
  });

  it("maps stock outline variant through governance props", () => {
    renderMenuTrigger({ variant: "outline" });

    const trigger = screen.getByRole("button", { name: "Collapse sidebar" });
    expect(trigger).toHaveAttribute("data-intent", "primary");
    expect(trigger).toHaveAttribute("data-emphasis", "outline");
  });
});
