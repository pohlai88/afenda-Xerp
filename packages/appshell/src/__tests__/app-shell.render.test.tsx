import { brandUserId } from "@afenda/kernel";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HomeIcon } from "lucide-react";

import { countDefaultAppShellUnreadNotifications } from "../shadcn-studio/data/app-shell.notification.data";
import { ApplicationShell } from "../app-shell";
import type { AppShellMenuItem } from "../shadcn-studio/data/app-shell.data";

function testUserId(value: string) {
  const userId = brandUserId(value);
  if (userId === null) {
    throw new Error("userId is required.");
  }
  return userId;
}

const customNavigationPages = [
  {
    icon: <HomeIcon aria-hidden />,
    label: "Custom module",
    href: "#custom",
  },
] satisfies readonly AppShellMenuItem[];

describe("ApplicationShell", () => {
  it("mounts the governed shell without TIP-004 consumer violations", () => {
    render(<ApplicationShell />);

    expect(screen.getByText("Hey, User")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Collapse sidebar" })
    ).toBeInTheDocument();
    expect(screen.getByText("Afenda ERP")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
  });

  it("renders custom main content when children are provided", () => {
    render(
      <ApplicationShell>
        <p>Custom workspace</p>
      </ApplicationShell>
    );

    expect(screen.getByText("Custom workspace")).toBeInTheDocument();
  });

  it("prefers explicit userName over identity.displayName", () => {
    render(
      <ApplicationShell
        identity={{
          displayName: "Identity Name",
          email: "identity@example.com",
          userId: testUserId("user_identity"),
        }}
        userName="Explicit Name"
      />
    );

    expect(screen.getByText("Hey, Explicit Name")).toBeInTheDocument();
  });

  it("falls back to identity.displayName and renders identityAccessory", () => {
    render(
      <ApplicationShell
        identity={{
          displayName: "Session User",
          email: "session@example.com",
          userId: testUserId("user_session"),
        }}
        identityAccessory={<button type="button">Sign out</button>}
      />
    );

    expect(screen.getByText("Hey, Session User")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign out" })
    ).toBeInTheDocument();
  });

  it("exposes a main landmark for page content", () => {
    render(
      <ApplicationShell>
        <p>Workspace body</p>
      </ApplicationShell>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveClass("app-shell-content");
    expect(main).toHaveAttribute("data-app-shell-content", "");
    expect(main).toHaveTextContent("Workspace body");
  });

  it("renders an empty workspace slot when children are omitted", () => {
    render(<ApplicationShell />);

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("data-app-shell-content", "");
    expect(main).toBeEmptyDOMElement();
  });

  it("announces unread notifications on the header trigger", () => {
    const unreadCount = countDefaultAppShellUnreadNotifications();
    render(<ApplicationShell />);

    expect(
      screen.getByRole("button", {
        name: `Notifications, ${unreadCount} unread`,
      })
    ).toBeInTheDocument();
  });

  it("renders footer social links with accessible names", () => {
    render(<ApplicationShell />);

    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Twitter" })).toBeInTheDocument();
  });

  it("supports custom navigation pages and search trigger label", () => {
    render(
      <ApplicationShell
        navigationPages={customNavigationPages}
        searchTriggerLabel="Find anything"
      />
    );

    expect(screen.getByText("Custom module")).toBeInTheDocument();
    expect(screen.getByText("Find anything")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("wires roleLabel to the sidebar user dropdown", () => {
    render(<ApplicationShell roleLabel="Finance lead" />);

    expect(screen.getByText("Finance lead")).toBeInTheDocument();
  });

  it("suppresses the footer brand link when footerBrand is empty", () => {
    render(<ApplicationShell footerBrand="" />);

    expect(screen.queryByRole("link", { name: "Afenda" })).not.toBeInTheDocument();
    expect(screen.getByText(/All rights reserved\./)).toBeInTheDocument();
  });

  it("renders the full operating context chain including workspace label", () => {
    render(
      <ApplicationShell
        operatingContext={{
          tenantLabel: "Dev Tenant",
          entityGroupLabel: "Dev Group",
          legalEntityLabel: "Dev Company",
          organizationUnitLabel: "Dev HQ",
          workspaceLabel: "Dev Company · Dev HQ",
        }}
      />
    );

    expect(
      screen.getByLabelText("Current operating context")
    ).toHaveTextContent(
      "Dev Tenant / Dev Group / Dev Company / Dev HQ / Dev Company · Dev HQ"
    );
  });

  it("renders a host-provided context switcher slot beside operating context", () => {
    render(
      <ApplicationShell
        contextSwitcher={<button type="button">Switch workspace</button>}
        operatingContext={{
          tenantLabel: "Dev Tenant",
          legalEntityLabel: "Dev Company",
          workspaceLabel: "Dev Company",
        }}
      />
    );

    expect(
      screen.getByRole("button", { name: "Switch workspace" })
    ).toBeInTheDocument();
  });
});
