import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShellApplicationShell02SystemAdminChrome } from "../shadcn-studio/blocks/app-shell-application-shell-02";

describe("AppShellApplicationShell02SystemAdminChrome", () => {
  it("renders section nav from system-admin sections", () => {
    render(
      <AppShellApplicationShell02SystemAdminChrome
        activeHref="/system-admin/settings"
        sections={[
          {
            sectionId: "settings",
            label: "Settings",
            href: "/system-admin/settings",
          },
          {
            sectionId: "users",
            label: "Users",
            href: "/system-admin/users",
          },
        ]}
        userProfile={{
          displayName: "Jane Admin",
          email: "jane@example.com",
          workspaceLabel: "Acme · HQ",
        }}
      />
    );

    expect(
      screen.getByRole("navigation", { name: "System admin sections" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByText("Jane Admin")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Acme · HQ")).toBeInTheDocument();
  });
});
