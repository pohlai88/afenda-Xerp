import {
  DashboardWidgetRenderContextProvider,
  DEFAULT_DASHBOARD_LAYOUT,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  serializeDashboardWidgetRenderContext,
} from "@afenda/appshell";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiPolicyGateError } from "@/lib/api/api-policy-gate.error";
import {
  fetchWorkspaceDashboardLayout,
  saveWorkspaceDashboardLayout,
} from "@/lib/api/dashboard-layout.client";
import {
  createDashboardRbacOperatingContextFixture,
  seedDashboardRbacAuthorizationStore,
} from "@/lib/workspace/__tests__/dashboard-rbac.fixture";
import { DEV_WORKSPACE_API_SCOPE } from "@/lib/workspace/dev-workspace-scope";
import { resolveWorkspaceDashboardCapabilitiesFromOperatingContext } from "@/lib/workspace/resolve-dashboard-widget-render-context.server";
import { WorkspaceApiScopeProvider } from "@/lib/workspace/workspace-api-scope.context";
import { WorkspaceDashboardCapabilitiesProvider } from "@/lib/workspace/workspace-dashboard-capabilities.context";
import { ProtectedWorkspaceDashboard } from "../protected-workspace-dashboard.client";
import { LayoutSaveTrigger } from "./layout-save-trigger.harness";
import { ProtectedHomeLayoutHarness } from "./protected-home-layout.harness";

vi.mock("@/lib/api/dashboard-layout.client", () => ({
  fetchWorkspaceDashboardLayout: vi.fn(async () => ({
    layout: DEFAULT_DASHBOARD_LAYOUT,
    source: "default",
    updatedAt: null,
  })),
  resetWorkspaceDashboardLayoutApi: vi.fn(),
  saveWorkspaceDashboardLayout: vi.fn(),
}));

const ALT_DASHBOARD_LAYOUT = {
  ...DEFAULT_DASHBOARD_LAYOUT,
  items: DEFAULT_DASHBOARD_LAYOUT.items.slice(0, 3),
};

function renderProtectedDashboard(canEditLayout: boolean) {
  return render(
    <WorkspaceApiScopeProvider scope={DEV_WORKSPACE_API_SCOPE}>
      <DashboardWidgetRenderContextProvider
        value={serializeDashboardWidgetRenderContext(
          PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
        )}
      >
        <WorkspaceDashboardCapabilitiesProvider value={{ canEditLayout }}>
          <ProtectedWorkspaceDashboard />
        </WorkspaceDashboardCapabilitiesProvider>
      </DashboardWidgetRenderContextProvider>
    </WorkspaceApiScopeProvider>
  );
}

function renderLayoutSaveHarness() {
  return render(
    <WorkspaceApiScopeProvider scope={DEV_WORKSPACE_API_SCOPE}>
      <LayoutSaveTrigger nextLayout={ALT_DASHBOARD_LAYOUT} />
    </WorkspaceApiScopeProvider>
  );
}

describe("ProtectedWorkspaceDashboard integration", () => {
  it("renders the governed canvas with real providers after layout load", async () => {
    renderProtectedDashboard(false);

    expect(screen.getByRole("status")).toHaveTextContent("Loading dashboard…");

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: "ERP overview dashboard" })
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("Edit mode")).not.toBeInTheDocument();
  });

  it("enables edit chrome when workspace.dashboard_write is granted", async () => {
    renderProtectedDashboard(true);

    await waitFor(() => {
      expect(screen.getByText("Edit mode")).toBeInTheDocument();
    });
  });

  it("reflects server-resolved canEditLayout through the protected layout provider chain", async () => {
    const dataSource = seedDashboardRbacAuthorizationStore([
      PERMISSION_REGISTRY.workspace.dashboard.write,
    ]);
    const capabilities =
      await resolveWorkspaceDashboardCapabilitiesFromOperatingContext(
        createDashboardRbacOperatingContextFixture(),
        dataSource
      );

    expect(capabilities).toEqual({ canEditLayout: true });

    render(
      <WorkspaceApiScopeProvider scope={DEV_WORKSPACE_API_SCOPE}>
        <DashboardWidgetRenderContextProvider
          value={serializeDashboardWidgetRenderContext(
            PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
          )}
        >
          <WorkspaceDashboardCapabilitiesProvider value={capabilities}>
            <ProtectedWorkspaceDashboard />
          </WorkspaceDashboardCapabilitiesProvider>
        </DashboardWidgetRenderContextProvider>
      </WorkspaceApiScopeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Edit mode")).toBeInTheDocument();
    });
  });

  it("shows policy gate dialog when layout PUT is denied", async () => {
    vi.mocked(saveWorkspaceDashboardLayout).mockRejectedValueOnce(
      new ApiPolicyGateError({
        gateDecision: "require_approval",
        correlationId: "corr-layout-put-gate",
        message: "Policy requires approval.",
      })
    );

    renderLayoutSaveHarness();

    fireEvent.click(
      screen.getByRole("button", { name: "Trigger layout save" })
    );

    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });
    expect(screen.getByText("Approval required")).toBeInTheDocument();
    expect(screen.getByText("Policy requires approval.")).toBeInTheDocument();
  });

  it("shows policy gate dialog on protected home when PUT is gated mid-session", async () => {
    vi.mocked(saveWorkspaceDashboardLayout).mockRejectedValueOnce(
      new ApiPolicyGateError({
        gateDecision: "require_step_up",
        correlationId: "corr-protected-put-gate",
        message: "Step-up required before saving layout.",
      })
    );

    render(
      <WorkspaceApiScopeProvider scope={DEV_WORKSPACE_API_SCOPE}>
        <DashboardWidgetRenderContextProvider
          value={serializeDashboardWidgetRenderContext(
            PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
          )}
        >
          <WorkspaceDashboardCapabilitiesProvider
            value={{ canEditLayout: true }}
          >
            <ProtectedHomeLayoutHarness
              nextLayoutForSave={ALT_DASHBOARD_LAYOUT}
            />
          </WorkspaceDashboardCapabilitiesProvider>
        </DashboardWidgetRenderContextProvider>
      </WorkspaceApiScopeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Edit mode")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Trigger protected layout save" })
    );

    await waitFor(() => {
      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });
    expect(screen.getByText("Verification required")).toBeInTheDocument();
    expect(
      screen.getByText("Step-up required before saving layout.")
    ).toBeInTheDocument();
  });

  it("shows policy gate inline surface when layout GET is gated on protected home", async () => {
    vi.mocked(fetchWorkspaceDashboardLayout).mockRejectedValueOnce(
      new ApiPolicyGateError({
        gateDecision: "require_approval",
        correlationId: "corr-protected-get-gate",
        message: "Policy requires approval to read layout.",
      })
    );

    render(
      <WorkspaceApiScopeProvider scope={DEV_WORKSPACE_API_SCOPE}>
        <DashboardWidgetRenderContextProvider
          value={serializeDashboardWidgetRenderContext(
            PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
          )}
        >
          <WorkspaceDashboardCapabilitiesProvider
            value={{ canEditLayout: true }}
          >
            <ProtectedHomeLayoutHarness />
          </WorkspaceDashboardCapabilitiesProvider>
        </DashboardWidgetRenderContextProvider>
      </WorkspaceApiScopeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Approval required")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Policy requires approval to read layout.")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeInTheDocument();
  });
});
