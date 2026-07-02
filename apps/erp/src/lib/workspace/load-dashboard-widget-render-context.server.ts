import type { OperatingContext } from "@afenda/kernel";
import { PERMISSION_REGISTRY } from "@afenda/permissions";

import { isOperatingContextPermissionGranted } from "@/lib/permissions/check-operating-context-permission.server";
import { DASHBOARD_DEFAULT_LAYOUT_PRESET } from "@/lib/workspace/dashboard-default-layout.preset";
import type { WorkspaceDashboardCapabilities } from "@/lib/workspace/workspace-dashboard-capabilities.contract";
import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";
import { getWorkspaceDashboardLayout } from "@/server/workspace/dashboard-layout.service";

export interface DashboardWidgetRenderContext {
  readonly capabilities: WorkspaceDashboardCapabilities;
  readonly layout: DashboardLayoutPresetDto;
  readonly layoutSource: "default" | "stored";
  readonly updatedAt: string | null;
}

export async function loadDashboardWidgetRenderContextForRequest(input: {
  readonly operatingContext: OperatingContext;
}): Promise<DashboardWidgetRenderContext> {
  const { operatingContext } = input;
  const layoutResult = await getWorkspaceDashboardLayout(
    operatingContext.workspace.tenantId,
    operatingContext.actor.userId
  );

  const canEditLayout = await isOperatingContextPermissionGranted({
    operatingContext,
    permissionKey: PERMISSION_REGISTRY.workspace.dashboard.write,
  });

  return {
    capabilities: { canEditLayout },
    layout: layoutResult.layout,
    layoutSource: layoutResult.source,
    updatedAt: layoutResult.updatedAt,
  };
}

export async function resolveWorkspaceDashboardCapabilitiesFromOperatingContext(
  operatingContext: OperatingContext
): Promise<WorkspaceDashboardCapabilities> {
  const canEditLayout = await isOperatingContextPermissionGranted({
    operatingContext,
    permissionKey: PERMISSION_REGISTRY.workspace.dashboard.write,
  });

  return { canEditLayout };
}

/** Preset used when the layout service has no stored layout for the actor. */
export function resolveDashboardDefaultLayoutPreset(): DashboardLayoutPresetDto {
  return DASHBOARD_DEFAULT_LAYOUT_PRESET;
}
