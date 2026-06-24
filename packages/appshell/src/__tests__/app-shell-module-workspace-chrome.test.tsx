import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShellModuleWorkspaceChrome } from "../shadcn-studio/blocks/app-shell-module-workspace-chrome.js";

describe("AppShellModuleWorkspaceChrome", () => {
  it("renders the module heading", () => {
    render(
      <AppShellModuleWorkspaceChrome
        moduleId="accounting"
        moduleLabel="Accounting"
      >
        <div>Content</div>
      </AppShellModuleWorkspaceChrome>
    );
    expect(
      screen.getByRole("heading", { name: "Accounting" })
    ).toBeInTheDocument();
  });

  it("renders breadcrumb nav when breadcrumbItems are provided", () => {
    render(
      <AppShellModuleWorkspaceChrome
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "HRM" }]}
        moduleId="hrm"
        moduleLabel="HRM"
      >
        <div>Content</div>
      </AppShellModuleWorkspaceChrome>
    );
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("does not render breadcrumb when breadcrumbItems is empty", () => {
    render(
      <AppShellModuleWorkspaceChrome
        breadcrumbItems={[]}
        moduleId="accounting"
        moduleLabel="Accounting"
      >
        <div>Content</div>
      </AppShellModuleWorkspaceChrome>
    );
    expect(
      screen.queryByRole("navigation", { name: "Breadcrumb" })
    ).not.toBeInTheDocument();
  });

  it("renders tab bar with active-route aria-current when tabs are provided", () => {
    render(
      <AppShellModuleWorkspaceChrome
        moduleId="inventory"
        moduleLabel="Inventory"
        tabs={[
          { label: "Overview", href: "/overview", active: true },
          { label: "Items", href: "/items" },
        ]}
      >
        <div>Content</div>
      </AppShellModuleWorkspaceChrome>
    );
    const tabNav = screen.getByRole("navigation", {
      name: "Module navigation",
    });
    expect(tabNav).toBeInTheDocument();
    const overviewLink = screen.getByRole("link", { name: "Overview" });
    expect(overviewLink).toHaveAttribute("aria-current", "page");
    const itemsLink = screen.getByRole("link", { name: "Items" });
    expect(itemsLink).not.toHaveAttribute("aria-current");
  });

  it("renders primary action slot", () => {
    render(
      <AppShellModuleWorkspaceChrome
        moduleId="sales"
        moduleLabel="Sales"
        primaryAction={<button type="button">New Sale</button>}
      >
        <div>Content</div>
      </AppShellModuleWorkspaceChrome>
    );
    expect(
      screen.getByRole("button", { name: "New Sale" })
    ).toBeInTheDocument();
  });

  it("renders children in workspace body", () => {
    render(
      <AppShellModuleWorkspaceChrome
        moduleId="accounting"
        moduleLabel="Accounting"
      >
        <div data-testid="workspace-content">Module body</div>
      </AppShellModuleWorkspaceChrome>
    );
    expect(screen.getByTestId("workspace-content")).toBeInTheDocument();
  });
});
