import { openMenu, setupUser } from "@afenda/testing/react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShellContextSwitcher } from "../presentation/blocks/app-shell-context-switcher";

const multiTargetOptions = {
  targets: [
    {
      companySlug: "alpha-co",
      label: "Alpha Co",
      isSelected: true,
    },
    {
      companySlug: "beta-co",
      organizationSlug: "finance-ou",
      label: "Beta Co · Finance OU",
      isSelected: false,
    },
  ],
} as const;

describe("AppShellContextSwitcher", () => {
  it("does not render when only one target is available", () => {
    const { container } = render(
      <AppShellContextSwitcher
        allowedOptions={{
          targets: [
            {
              companySlug: "dev-company",
              label: "Dev Company",
              isSelected: true,
            },
          ],
        }}
        onSelect={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a switch trigger when multiple targets are available", () => {
    render(
      <AppShellContextSwitcher
        allowedOptions={multiTargetOptions}
        onSelect={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: "Switch workspace context" })
    ).toBeInTheDocument();
    expect(
      document.querySelector(".app-shell-context-switcher-dropdown")
    ).toBeNull();
  });

  it("marks the trigger busy while a context switch is pending", () => {
    render(
      <AppShellContextSwitcher
        allowedOptions={multiTargetOptions}
        isPending
        onSelect={vi.fn()}
      />
    );

    const trigger = screen.getByRole("button", {
      name: "Switch workspace context",
    });
    expect(trigger).toHaveAttribute("aria-busy", "true");
    expect(trigger).toBeDisabled();
  });

  it("opens the menu and calls onSelect with org-aware target values", async () => {
    const user = setupUser();
    const onSelect = vi.fn();

    render(
      <AppShellContextSwitcher
        allowedOptions={multiTargetOptions}
        onSelect={onSelect}
      />
    );

    const menu = await openMenu(user, "Switch workspace context");

    expect(within(menu).getByText("Switch workspace")).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitemradio", { name: "Beta Co · Finance OU" })
    ).toBeInTheDocument();

    await user.click(
      within(menu).getByRole("menuitemradio", { name: "Beta Co · Finance OU" })
    );

    expect(onSelect).toHaveBeenCalledWith({
      companySlug: "beta-co",
      organizationSlug: "finance-ou",
    });
  });
});
