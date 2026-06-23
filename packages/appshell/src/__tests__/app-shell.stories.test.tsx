import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "../app-shell.stories";

const {
  Default,
  FinanceModule,
  AuthenticatedSession,
  InventoryWorkspace,
  MinimalFooter,
  CustomBranding,
} = composeStories(stories);

describe("ApplicationShell stories (portable CSF)", () => {
  it("Default renders ERP baseline greeting from story args", () => {
    render(<Default />);

    expect(screen.getByText("Hey, Alex Morgan")).toBeInTheDocument();
    expect(
      screen.getByText("Good morning — Finance module")
    ).toBeInTheDocument();
    expect(screen.getByText("Afenda ERP")).toBeInTheDocument();
  });

  it("FinanceModule applies finance-specific labels from fixtures", () => {
    render(<FinanceModule />);

    expect(screen.getByText("Finance modules")).toBeInTheDocument();
    expect(screen.getByText("Finance team")).toBeInTheDocument();
    expect(screen.getByText("Search finance records…")).toBeInTheDocument();
    expect(screen.getByText("Hey, Jordan Rivera")).toBeInTheDocument();
  });

  it("AuthenticatedSession uses identity displayName and story auth accessory", () => {
    render(<AuthenticatedSession />);

    expect(screen.getByText("Hey, Jordan Rivera")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign out" })
    ).toBeInTheDocument();
  });

  it("InventoryWorkspace renders AppShellMain workspace from story composition", () => {
    render(<InventoryWorkspace />);

    expect(
      screen.getByRole("heading", { name: "Stock overview" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New transfer" })
    ).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("MinimalFooter hides the footer brand link from story args", () => {
    render(<MinimalFooter />);

    expect(
      screen.queryByRole("link", { name: "Afenda" })
    ).not.toBeInTheDocument();
    expect(screen.getByText(/All rights reserved\./)).toBeInTheDocument();
  });

  it("CustomBranding applies white-label props from fixtures", () => {
    render(<CustomBranding />);

    expect(screen.getByText("ACME Corp ERP")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ACME Corp" })).toBeInTheDocument();
    expect(screen.getByText("Modules")).toBeInTheDocument();
  });
});
