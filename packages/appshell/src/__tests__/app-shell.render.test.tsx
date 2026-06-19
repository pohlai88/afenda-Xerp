import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "../app-shell";
import { AppShellMain } from "../app-shell-main";

describe("AppShell render", () => {
  it("renders skip link, header, navigation, main landmark, and command center", () => {
    render(
      <AppShell activeItemId="nexus">
        <AppShellMain description="Test page description" title="Dashboard">
          <p>Content</p>
        </AppShellMain>
      </AppShell>
    );

    expect(
      screen.getByRole("link", { name: "Skip to content" })
    ).toHaveAttribute("href", "#app-shell-main");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "ERP modules" })
    ).toBeInTheDocument();
    expect(screen.getByRole("main", { name: undefined })).toHaveAttribute(
      "id",
      "app-shell-main"
    );
    expect(screen.getByLabelText("Command center")).toHaveTextContent(
      "Command center coming soon"
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" })
    ).toBeInTheDocument();
    expect(screen.getByText("Nexus")).toHaveAttribute("aria-current", "page");
  });
});
