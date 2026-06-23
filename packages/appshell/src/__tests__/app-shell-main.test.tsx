import { Badge, Button } from "@afenda/ui";
import { mapStockButtonProps } from "@afenda/ui/governance";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShellMain } from "../app-shell-main";
import {
  DEFAULT_APP_SHELL_MAIN_CONTENT_LABEL,
  DEFAULT_APP_SHELL_MAIN_TITLE_ID,
} from "../shadcn-studio/data/app-shell.main.constants";

describe("AppShellMain", () => {
  it("renders title, description, and children on plain HTML wrappers", () => {
    render(
      <AppShellMain description="Module overview" title="Dashboard">
        <p>Workspace body</p>
      </AppShellMain>
    );

    const region = screen.getByRole("region", {
      name: DEFAULT_APP_SHELL_MAIN_CONTENT_LABEL,
    });
    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" })
    ).toHaveAttribute("id", DEFAULT_APP_SHELL_MAIN_TITLE_ID);
    expect(screen.getByRole("region", { name: "Dashboard" })).toHaveAttribute(
      "aria-labelledby",
      DEFAULT_APP_SHELL_MAIN_TITLE_ID
    );
    expect(screen.getByText("Module overview")).toBeInTheDocument();
    expect(within(region).getByText("Workspace body")).toBeInTheDocument();
  });

  it("renders governed badge and action slots without TIP-004 violations", () => {
    render(
      <AppShellMain
        actions={
          <Button {...mapStockButtonProps("default")} type="button">
            Export
          </Button>
        }
        badge={
          <Badge emphasis="soft" tone="success">
            Live
          </Badge>
        }
        title="Orders"
      >
        <p>Orders table</p>
      </AppShellMain>
    );

    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
    expect(
      screen.getByText("Live").closest("[data-slot='badge']")
    ).not.toBeNull();
  });

  it("omits description and body region when not provided", () => {
    render(<AppShellMain title="Settings" />);

    expect(
      screen.queryByRole("region", {
        name: DEFAULT_APP_SHELL_MAIN_CONTENT_LABEL,
      })
    ).toBeNull();
    expect(screen.queryByText("Module overview")).not.toBeInTheDocument();
  });

  it("supports custom title and content labels", () => {
    render(
      <AppShellMain
        contentLabel="Workspace modules"
        title="Finance"
        titleId="finance-page-title"
      >
        <p>Finance body</p>
      </AppShellMain>
    );

    expect(screen.getByRole("heading", { name: "Finance" })).toHaveAttribute(
      "id",
      "finance-page-title"
    );
    expect(
      screen.getByRole("region", { name: "Workspace modules" })
    ).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Finance" })).toHaveAttribute(
      "aria-labelledby",
      "finance-page-title"
    );
  });
});
