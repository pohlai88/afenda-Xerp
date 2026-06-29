import type { OperatingContext } from "@afenda/kernel";

/** ADR-0027 stub — widget render context without appshell registry. */
export async function loadDashboardWidgetRenderContextForRequest(_input: {
  readonly operatingContext: OperatingContext;
}) {
  return {
    widgets: [] as const,
  };
}

export function resolveWorkspaceDashboardCapabilitiesFromOperatingContext(
  _context: OperatingContext
) {
  return {
    canCustomizeLayout: false,
    canViewDashboard: true,
  };
}
