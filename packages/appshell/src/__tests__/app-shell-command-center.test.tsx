import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_COMMAND_ITEMS,
  resolveAppShellCommandItemTitle,
} from "../app-shell.types";
import { AppShellCommandCenter } from "../app-shell-command-center";

describe("AppShellCommandCenter", () => {
  it("renders governed region with shortcut and coming-soon indicator", () => {
    render(<AppShellCommandCenter items={DEFAULT_COMMAND_ITEMS} />);

    const region = screen.getByRole("region", { name: "Command center" });
    expect(
      within(region).getByRole("heading", { level: 2, name: "Command center" })
    ).toBeInTheDocument();
    expect(within(region).getByText("⌘K")).toBeInTheDocument();
    expect(within(region).getByText("Soon")).toBeInTheDocument();
  });

  it("renders ready commands as links without href fallback", () => {
    render(
      <AppShellCommandCenter
        items={[
          {
            id: "open-settings",
            label: "Settings",
            href: "/settings",
            order: 10,
            state: "ready",
            description: "Open workspace settings",
          },
        ]}
      />
    );

    const link = screen.getByRole("link", { name: "Settings" });
    expect(link).toHaveAttribute("href", "/settings");
    expect(link).toHaveAttribute("title", "Open workspace settings");
  });

  it("surfaces unavailable reason via title when description is missing", () => {
    expect(
      resolveAppShellCommandItemTitle({
        label: "Reports",
        state: "disabled",
      })
    ).toBe("Reports is currently unavailable");
  });
});
