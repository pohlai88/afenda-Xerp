import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_WORKSPACE_CONTEXT } from "../app-shell.types";
import { AppShellContextSwitcher } from "../app-shell-context-switcher";

describe("AppShellContextSwitcher", () => {
  it("renders compact company and organization with audit ids", () => {
    render(
      <AppShellContextSwitcher compact workspace={DEFAULT_WORKSPACE_CONTEXT} />
    );

    expect(
      screen.getByRole("region", { name: "Workspace context" })
    ).toBeInTheDocument();
    expect(screen.getByText("Demo Company")).toBeInTheDocument();
    expect(screen.getByText("Demo Organization")).toBeInTheDocument();
    expect(screen.queryByText("Demo Tenant")).not.toBeInTheDocument();

    const company = screen.getByText("Demo Company");
    expect(company).toHaveAttribute("data-context-id", "company-demo");
    expect(company).toHaveAttribute("data-context-kind", "company");
  });

  it("shows tenant when not compact", () => {
    render(
      <AppShellContextSwitcher
        compact={false}
        workspace={DEFAULT_WORKSPACE_CONTEXT}
      />
    );

    expect(screen.getByText("Demo Tenant")).toBeInTheDocument();
  });

  it("renders loading status and hides context values", () => {
    render(
      <AppShellContextSwitcher
        state="loading"
        workspace={DEFAULT_WORKSPACE_CONTEXT}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading workspace context"
    );
    expect(screen.queryByText("Demo Company")).not.toBeInTheDocument();
  });

  it("calls onSwitchRequest when switch action is available", () => {
    const onSwitchRequest = vi.fn();

    render(
      <AppShellContextSwitcher
        onSwitchRequest={onSwitchRequest}
        workspace={DEFAULT_WORKSPACE_CONTEXT}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Switch workspace" }));
    expect(onSwitchRequest).toHaveBeenCalledOnce();
  });
});
