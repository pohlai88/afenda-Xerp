import { DASHBOARD_DEFAULT_LAYOUT_PRESET } from "@/lib/workspace/dashboard-default-layout.preset";
import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";
import { dashboardLayoutPresetSchema } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

const DEFAULT_DASHBOARD_LAYOUT: DashboardLayoutPresetDto =
  DASHBOARD_DEFAULT_LAYOUT_PRESET;

interface StoredDashboardLayout {
  readonly layout: DashboardLayoutPresetDto;
  readonly updatedAt: string;
}

const workspaceDashboardLayoutStore = new Map<string, StoredDashboardLayout>();

function buildDashboardLayoutStorageKey(
  tenantId: string,
  userId: string
): string {
  return `${tenantId}:${userId}`;
}

function assertLayoutIntegrity(layout: DashboardLayoutPresetDto): void {
  const parsed = dashboardLayoutPresetSchema.safeParse(layout);

  if (!parsed.success) {
    throw new ApiRouteError(
      "validation_failed",
      "Dashboard layout preset is malformed."
    );
  }
}

export async function getWorkspaceDashboardLayout(
  tenantId: string,
  userId: string
) {
  const stored = workspaceDashboardLayoutStore.get(
    buildDashboardLayoutStorageKey(tenantId, userId)
  );

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
  tenantId: string,
  userId: string,
  layout: DashboardLayoutPresetDto
) {
  assertLayoutIntegrity(layout);

  const updatedAt = new Date().toISOString();
  workspaceDashboardLayoutStore.set(
    buildDashboardLayoutStorageKey(tenantId, userId),
    { layout, updatedAt }
  );

  return {
    layout,
    source: "stored" as const,
    updatedAt,
  };
}

export async function resetWorkspaceDashboardLayout(
  tenantId: string,
  userId: string
) {
  workspaceDashboardLayoutStore.delete(
    buildDashboardLayoutStorageKey(tenantId, userId)
  );
  return { reset: true as const };
}

export function clearWorkspaceDashboardLayoutStoreForTests(): void {
  workspaceDashboardLayoutStore.clear();
}
