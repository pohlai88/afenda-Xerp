import { loadProtectedRequestOperatingContext } from "@/lib/context/load-protected-request-operating-context.server";
import { loadDashboardWidgetRenderContextForRequest } from "@/lib/workspace/load-dashboard-widget-render-context.server";
import { WorkspaceDashboardCapabilitiesProvider } from "@/lib/workspace/workspace-dashboard-capabilities.context";
import {
  WORKSPACE_HOME_COPY,
  WORKSPACE_HOME_PAGE_TITLE_ID,
} from "@/lib/workspace/workspace-home.copy.contract";

import { DashboardLayoutRenderer } from "./_components/dashboard-layout-renderer.client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: WORKSPACE_HOME_COPY.page.title,
};

export default async function WorkspacePage() {
  const { operatingResult } = await loadProtectedRequestOperatingContext();

  if (!operatingResult.ok) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
        <h1 className="font-semibold text-2xl">
          {WORKSPACE_HOME_COPY.page.title}
        </h1>
        <p className="text-muted-foreground text-sm">
          {operatingResult.error.userMessage}
        </p>
      </main>
    );
  }

  const renderContext = await loadDashboardWidgetRenderContextForRequest({
    operatingContext: operatingResult.value,
  });

  return (
    <WorkspaceDashboardCapabilitiesProvider value={renderContext.capabilities}>
      <section
        aria-labelledby={WORKSPACE_HOME_PAGE_TITLE_ID}
        className="flex flex-col gap-6 p-6"
      >
        <header className="flex flex-col gap-2">
          <h1
            className="font-semibold text-2xl"
            id={WORKSPACE_HOME_PAGE_TITLE_ID}
          >
            {WORKSPACE_HOME_COPY.page.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {WORKSPACE_HOME_COPY.page.description}
          </p>
        </header>
        <DashboardLayoutRenderer layout={renderContext.layout} />
      </section>
    </WorkspaceDashboardCapabilitiesProvider>
  );
}
