import {
  DashboardWidgetRenderContextProvider,
  DEFAULT_APP_SHELL_DASHBOARD_LABEL,
  DEFAULT_DASHBOARD_LAYOUT,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  serializeDashboardWidgetRenderContext,
} from "@afenda/appshell";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
import { WORKSPACE_HOME_COPY } from "@/lib/workspace/workspace-home.copy.contract";
import { ProtectedWorkspaceDashboard } from "../protected-workspace-dashboard.client";
import { LayoutSaveTrigger } from "./layout-save-trigger.harness";
import { ProtectedHomeLayoutHarness } from "./protected-home-layout.harness";

const DASHBOARD_INTEGRATION_TIMEOUT_MS = 30_000;
const DASHBOARD_LOAD_WAIT_MS = 15_000;

vi.mock("@/lib/api/dashboard-layout.client", () => ({
  fetchWorkspaceDashboardLayout: vi.fn(async () => ({
    layout: DEFAULT_DASHBOARD_LAYOUT,
    source: "default",
    updatedAt: null,
  })),
  resetWorkspaceDashboardLayoutApi: vi.fn(),
  saveWorkspaceDashboardLayout: vi.fn(async () => ({
    layout: DEFAULT_DASHBOARD_LAYOUT,
    source: "stored",
    updatedAt: "2026-06-22T12:00:00.000Z",
  })),
}));

const ALT_DASHBOARD_LAYOUT = {
  ...DEFAULT_DASHBOARD_LAYOUT,
  items: DEFAULT_DASHBOARD_LAYOUT.items.slice(0, 3),
};

function resetDashboardLayoutClientMocks() {
  vi.mocked(fetchWorkspaceDashboardLayout).mockImplementation(async () => ({
    layout: DEFAULT_DASHBOARD_LAYOUT,
    source: "default",
    updatedAt: null,
  }));
  vi.mocked(saveWorkspaceDashboardLayout).mockImplementation(async () => ({
    layout: DEFAULT_DASHBOARD_LAYOUT,
    source: "stored",
    updatedAt: "2026-06-22T12:00:00.000Z",
  }));
}

async function waitForDashboardCanvas() {
  await waitFor(
    () => {
      expect(
        screen.getByRole("region", { name: DEFAULT_APP_SHELL_DASHBOARD_LABEL })
      ).toBeInTheDocument();
    },
    { timeout: DASHBOARD_LOAD_WAIT_MS }
  );
}

function expectUserSafeSurfaceCopy(visibleText: string) {
  expect(visibleText).not.toMatch(/sql:|violates unique constraint|\.stack/i);
  expect(visibleText).not.toMatch(/packages\/|node_modules\//);
}

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

describe(
  "ProtectedWorkspaceDashboard integration",
  () => {
    beforeEach(() => {
      resetDashboardLayoutClientMocks();
    });

    it("renders the governed canvas with real providers after layout load", async () => {
      renderProtectedDashboard(false);

      expect(screen.getByRole("status")).toHaveTextContent(
        "Loading dashboard…"
      );

      await waitForDashboardCanvas();

      expect(
        screen.getByText(WORKSPACE_HOME_COPY.dashboard.status.default)
      ).toBeInTheDocument();
      expect(screen.queryByText("Edit mode")).not.toBeInTheDocument();
    });

    it("enables edit chrome when workspace.dashboard_write is granted", async () => {
      renderProtectedDashboard(true);

      await waitForDashboardCanvas();

      expect(screen.getByText("Edit mode")).toBeInTheDocument();
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

      await waitForDashboardCanvas();

      expect(screen.getByText("Edit mode")).toBeInTheDocument();
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

      const user = setupUser();
      await user.click(
        screen.getByRole("button", { name: "Trigger layout save" })
      );

      await waitFor(
        () => {
          expect(screen.getByRole("alertdialog")).toBeInTheDocument();
        },
        { timeout: DASHBOARD_LOAD_WAIT_MS }
      );
      expect(screen.getByText("Approval required")).toBeInTheDocument();
      const gateCopy = screen.getByText("Policy requires approval.");
      expectUserSafeSurfaceCopy(gateCopy.textContent ?? "");
    });

    it("shows policy gate dialog on protected home when PUT is gated mid-session", async () => {
      vi.mocked(saveWorkspaceDashboardLayout).mockImplementation(
        async (_scope, layout) => {
          if (layout.items.length < DEFAULT_DASHBOARD_LAYOUT.items.length) {
            throw new ApiPolicyGateError({
              gateDecision: "require_step_up",
              correlationId: "corr-protected-put-gate",
              message: "Step-up required before saving layout.",
            });
          }

          return {
            layout: DEFAULT_DASHBOARD_LAYOUT,
            source: "stored",
            updatedAt: "2026-06-22T12:00:00.000Z",
          };
        }
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

      await waitForDashboardCanvas();

      const user = setupUser();
      await user.click(
        screen.getByRole("button", { name: "Trigger protected layout save" })
      );

      await waitFor(
        () => {
          expect(screen.getByRole("alertdialog")).toBeInTheDocument();
        },
        { timeout: DASHBOARD_LOAD_WAIT_MS }
      );
      expect(screen.getByText("Verification required")).toBeInTheDocument();
      const gateCopy = screen.getByText(
        "Step-up required before saving layout."
      );
      expectUserSafeSurfaceCopy(gateCopy.textContent ?? "");
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
      const gateCopy = screen.getByText(
        "Policy requires approval to read layout."
      );
      expectUserSafeSurfaceCopy(gateCopy.textContent ?? "");
      await waitForDashboardCanvas();
    });
  },
  DASHBOARD_INTEGRATION_TIMEOUT_MS
);
