import {
  DashboardWidgetRenderContextProvider,
  DEFAULT_DASHBOARD_LAYOUT,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  serializeDashboardWidgetRenderContext,
} from "@afenda/appshell";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiClientRequestError } from "@/lib/api/api-policy-gate.error";
import { fetchWorkspaceDashboardLayout } from "@/lib/api/dashboard-layout.client";
import { AppShellCanvasHarness } from "../appshell-canvas-harness";

vi.mock("@/lib/api/dashboard-layout.client", () => ({
  fetchWorkspaceDashboardLayout: vi.fn(async () => ({
    layout: DEFAULT_DASHBOARD_LAYOUT,
    source: "default",
    updatedAt: null,
  })),
  resetWorkspaceDashboardLayoutApi: vi.fn(),
  saveWorkspaceDashboardLayout: vi.fn(),
}));

const DEV_SCOPE = {
  tenantSlug: "dev-local",
  companySlug: "dev-company",
  organizationSlug: "dev-hq",
} as const;

const mockClearGate = () => undefined;
const mockHandleApiError = () => false;

vi.mock("@/lib/workspace/workspace-api-scope.context", () => ({
  useOptionalWorkspaceApiScope: () => DEV_SCOPE,
}));

vi.mock("@/lib/api/use-policy-gate-handler.client", () => ({
  usePolicyGateHandler: () => ({
    clearGate: mockClearGate,
    gateState: null,
    handleApiError: mockHandleApiError,
  }),
}));

function renderCanvasHarness() {
  return render(
    <DashboardWidgetRenderContextProvider
      value={serializeDashboardWidgetRenderContext(
        PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT
      )}
    >
      <AppShellCanvasHarness />
    </DashboardWidgetRenderContextProvider>
  );
}

describe("AppShellCanvasHarness dev fallback", () => {
  it("renders default layout copy when layout API returns 401", async () => {
    // ApplicationShellDashboardCanvas + appshell bundle load can exceed 10s under full-suite CPU contention.
    vi.mocked(fetchWorkspaceDashboardLayout).mockRejectedValue(
      new ApiClientRequestError({
        code: "unauthenticated",
        correlationId: "corr-canvas-401",
        message: "Authentication is required.",
      })
    );

    renderCanvasHarness();

    await waitFor(() => {
      expect(
        screen.getByText(
          "Using default layout (sign in to load or save workspace layout)."
        )
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset layout" })).toBeDisabled();
  }, 20_000);
});
