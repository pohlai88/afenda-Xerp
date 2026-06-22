import {
  DEFAULT_DASHBOARD_LAYOUT,
  getDashboardWidgetRegistry,
  parseDashboardLayoutPreset,
  validateDashboardLayoutPreset,
} from "@afenda/appshell";

import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

interface StoredDashboardLayout {
  readonly layout: DashboardLayoutPresetDto;
  readonly updatedAt: string;
}

const workspaceDashboardLayoutStore = new Map<string, StoredDashboardLayout>();

function assertLayoutIntegrity(layout: DashboardLayoutPresetDto): void {
  const preset = parseDashboardLayoutPreset(layout);

  if (preset === null) {
    throw new ApiRouteError(
      "validation_failed",
      "Dashboard layout preset is malformed."
    );
  }

  const validation = validateDashboardLayoutPreset(
    preset,
    getDashboardWidgetRegistry()
  );

  if (!validation.valid) {
    throw new ApiRouteError(
      "validation_failed",
      validation.reason ?? "Dashboard layout failed integrity validation."
    );
  }
}

export async function getWorkspaceDashboardLayout(userId: string) {
  const stored = workspaceDashboardLayoutStore.get(userId);

  if (stored === undefined) {
    return {
      layout: DEFAULT_DASHBOARD_LAYOUT,
      source: "default" as const,
      updatedAt: null,
    };
  }

  return {
    layout: stored.layout,
    source: "stored" as const,
    updatedAt: stored.updatedAt,
  };
}

export async function saveWorkspaceDashboardLayout(
  userId: string,
  layout: DashboardLayoutPresetDto
) {
  assertLayoutIntegrity(layout);

  const updatedAt = new Date().toISOString();
  workspaceDashboardLayoutStore.set(userId, { layout, updatedAt });

  return {
    layout,
    source: "stored" as const,
    updatedAt,
  };
}

export async function resetWorkspaceDashboardLayout(userId: string) {
  workspaceDashboardLayoutStore.delete(userId);
  return { reset: true as const };
}

export function clearWorkspaceDashboardLayoutStoreForTests(): void {
  workspaceDashboardLayoutStore.clear();
}
