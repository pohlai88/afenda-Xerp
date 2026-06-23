import {
  ApplicationShell,
  DashboardWidgetRenderContextProvider,
} from "@afenda/appshell";
import type { Metadata } from "next";

import { AppShellCanvasHarness } from "@/components/appshell-canvas-harness";
import { DEV_WORKSPACE_API_SCOPE } from "@/lib/workspace/dev-workspace-scope";
import { loadDashboardWidgetRenderContextForRequest } from "@/lib/workspace/load-dashboard-widget-render-context.server";
import { WorkspaceApiScopeProvider } from "@/lib/workspace/workspace-api-scope.context";

export const metadata = {
  title: "AppShell dashboard canvas",
  description: "Editable dashboard canvas demo with layout reset.",
  robots: {
    index: false,
    follow: false,
  },
} satisfies Metadata;

export default async function AppShellCanvasPage() {
  const dashboardRenderContext =
    await loadDashboardWidgetRenderContextForRequest({
      devFallback: true,
    });

  return (
    <ApplicationShell
      userName="Demo User"
      welcomeMessage="Editable dashboard canvas"
    >
      <WorkspaceApiScopeProvider scope={DEV_WORKSPACE_API_SCOPE}>
        <DashboardWidgetRenderContextProvider value={dashboardRenderContext}>
          <AppShellCanvasHarness showRbacPreviewControls />
        </DashboardWidgetRenderContextProvider>
      </WorkspaceApiScopeProvider>
    </ApplicationShell>
  );
}
