import { ApplicationShellDashboardCanvas } from "./app-shell-dashboard-canvas.client";

export interface ApplicationShellDashboardDemoProps {
  readonly dashboardLabel?: string;
  readonly showReadonlyPreviewLabel?: boolean;
}

export function ApplicationShellDashboardDemo({
  dashboardLabel,
  showReadonlyPreviewLabel = false,
}: ApplicationShellDashboardDemoProps = {}) {
  return (
    <ApplicationShellDashboardCanvas
      {...(dashboardLabel === undefined ? {} : { dashboardLabel })}
      editMode={false}
      showReadonlyPreviewLabel={showReadonlyPreviewLabel}
    />
  );
}
