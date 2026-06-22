import { ApplicationShellDashboardCanvas } from "./app-shell-dashboard-canvas.client";
import type { DashboardWidgetRenderContext } from "./dashboard-widget.contract";

export interface ApplicationShellDashboardDemoProps {
  readonly dashboardLabel?: string;
  readonly showReadonlyPreviewLabel?: boolean;
  readonly renderContext?: DashboardWidgetRenderContext;
}

export function ApplicationShellDashboardDemo({
  dashboardLabel,
  showReadonlyPreviewLabel = false,
  renderContext,
}: ApplicationShellDashboardDemoProps = {}) {
  return (
    <ApplicationShellDashboardCanvas
      {...(dashboardLabel === undefined ? {} : { dashboardLabel })}
      {...(renderContext === undefined ? {} : { renderContext })}
      editMode={false}
      showReadonlyPreviewLabel={showReadonlyPreviewLabel}
    />
  );
}
