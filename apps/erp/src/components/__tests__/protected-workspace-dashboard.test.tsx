import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ProtectedWorkspaceDashboard } from "../protected-workspace-dashboard.client";

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
    errorMessage: null,
    isLoading: false,
    layout: { version: 1, items: [] },
    resetLayout: async () => undefined,
    saveLayout: async () => undefined,
    updatedAt: null,
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
  it("renders the governed dashboard canvas with server RBAC context", () => {
    render(<ProtectedWorkspaceDashboard />);

    expect(
      screen.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeInTheDocument();
  });
});
