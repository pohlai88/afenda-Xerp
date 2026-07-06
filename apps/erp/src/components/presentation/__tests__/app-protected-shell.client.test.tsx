// @vitest-environment jsdom

import {
  StudioPresentationProviders,
  type AppShellNavGroupWire,
} from "@afenda/shadcn-studio-v2/clients";
import { render, screen } from "@afenda/testing/react";
import { describe, expect, it, vi } from "vitest";

import { AppProtectedShell } from "../app-protected-shell.client";

vi.mock("next/navigation", () => ({
  usePathname: () => "/workspace",
}));

const navGroups = [
  {
    id: "platform",
    items: [
      {
        href: "/workspace",
        id: "workspace",
        isActive: true,
        label: "Workspace",
      },
    ],
    label: "Platform",
  },
] as const satisfies readonly AppShellNavGroupWire[];

const operatingContext = {
  legalEntityLabel: "Acme Holdings",
  tenantLabel: "Acme Tenant",
  workspaceLabel: "Acme Holdings · Finance",
} as const;

describe("AppProtectedShell", () => {
  it("renders v2 AppShell01 with primary navigation and workspace context", () => {
    render(
      <StudioPresentationProviders>
        <AppProtectedShell
          navGroups={navGroups}
          operatingContext={operatingContext}
        >
          <section>
            <h1>Protected route</h1>
          </section>
        </AppProtectedShell>
      </StudioPresentationProviders>
    );

    expect(screen.getByRole("heading", { name: "Protected route" })).toBeVisible();
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" })
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Workspace" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getAllByText("Acme Tenant")).toHaveLength(2);
    expect(screen.getAllByText("Acme Holdings · Finance")).toHaveLength(2);
  });
});
