import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { WORKSPACE_HOME_COPY } from "@/lib/workspace/workspace-home.copy.contract";
import { ProtectedWorkspaceDashboard } from "../protected-workspace-dashboard.client";

const mockLayoutState = {
  errorMessage: null as string | null,
  isLoading: false,
  layout: { version: 1, items: [] },
  layoutLoadFallback: null as "unauthenticated" | null,
  updatedAt: null as string | null,
};

vi.mock("@/lib/workspace/workspace-dashboard-capabilities.context", () => ({
  useWorkspaceDashboardCapabilities: () => ({ canEditLayout: false }),
}));

vi.mock("@/lib/workspace/workspace-api-scope.context", () => ({
  useWorkspaceApiScope: () => ({
    tenantSlug: "dev-local",
    companySlug: "dev-company",
    organizationSlug: "dev-hq",
  }),
}));

vi.mock("@afenda/appshell", async () => {
  const actual =
    await vi.importActual<typeof import("@afenda/appshell")>(
      "@afenda/appshell"
    );

  return {
    ...actual,
    useDashboardWidgetRenderContext: () =>
      actual.PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
    ApplicationShellDashboardCanvas: () => (
      <div aria-label="ERP overview dashboard" role="region">
        Workspace dashboard canvas
      </div>
    ),
  };
});

vi.mock("@/lib/workspace/use-workspace-dashboard-layout.client", () => ({
  useWorkspaceDashboardLayout: () => ({
    ...mockLayoutState,
    resetLayout: async () => undefined,
    saveLayout: async () => undefined,
    canPersistLayout: true,
  }),
}));

vi.mock("@/lib/api/use-policy-gate-handler.client", () => ({
  usePolicyGateHandler: () => ({
    clearGate: () => undefined,
    gateState: null,
    handleApiError: () => false,
  }),
}));

describe("ProtectedWorkspaceDashboard", () => {
  it("renders the governed dashboard canvas with default layout status copy", () => {
    mockLayoutState.errorMessage = null;
    mockLayoutState.isLoading = false;
    mockLayoutState.layoutLoadFallback = null;
    mockLayoutState.updatedAt = null;

    render(<ProtectedWorkspaceDashboard />);

    expect(
      screen.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeInTheDocument();
    expect(screen.getByText("Using default layout.")).toBeInTheDocument();
  });

  it("renders skeleton loading state with screen reader copy", () => {
    mockLayoutState.isLoading = true;

    render(<ProtectedWorkspaceDashboard />);

    expect(screen.getByRole("status")).toHaveTextContent(
      WORKSPACE_HOME_COPY.dashboard.loadingScreenReader
    );
    expect(screen.queryByRole("region")).not.toBeInTheDocument();

    mockLayoutState.isLoading = false;
  });

  it("renders governed Alert when layout load fails", () => {
    mockLayoutState.errorMessage = "Failed to load dashboard layout.";
    mockLayoutState.isLoading = false;

    render(<ProtectedWorkspaceDashboard />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      WORKSPACE_HOME_COPY.dashboard.errorAlertTitle
    );
    expect(
      screen.getByText("Failed to load dashboard layout.")
    ).toBeInTheDocument();

    mockLayoutState.errorMessage = null;
  });
});
