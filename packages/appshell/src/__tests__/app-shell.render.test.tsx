import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "../app-shell";
import { AppShellMain } from "../app-shell-main";

describe("AppShell render", () => {
  it("renders skip link, header, navigation, main landmark, and command center", () => {
    render(
      <AppShell currentPathname="/">
        <AppShellMain description="Test page description" title="Dashboard">
          <p>Content</p>
        </AppShellMain>
      </AppShell>
    );

    expect(
      screen.getByRole("link", { name: "Skip to content" })
    ).toHaveAttribute("href", "#app-shell-main");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Application header")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Afenda ERP home" })
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("region", { name: "Workspace context" })
    ).toBeInTheDocument();
    expect(screen.getByText("Demo Company")).toBeInTheDocument();
    expect(screen.queryByText("Demo Tenant")).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "ERP modules" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "ERP modules",
        hidden: true,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute(
      "id",
      "app-shell-main"
    );
    expect(
      screen.getByRole("region", { name: "Command center" })
    ).toHaveTextContent("Command center");
    expect(screen.getByText("⌘K")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" })
    ).toBeInTheDocument();

    const nexusLink = screen.getByRole("link", { name: "Nexus" });
    expect(nexusLink).toHaveAttribute("href", "/");
    expect(nexusLink).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByText("Soon")).toHaveLength(8);
    expect(
      screen.queryByRole("link", { name: "Manufacturing" })
    ).not.toBeInTheDocument();
  });
});
