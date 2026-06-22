import type {
  DashboardLayoutPresetDto,
  DashboardLayoutResponseDto,
} from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

import { readApiEnvelope } from "./api-envelope.client";
import {
  assertApiSuccessEnvelope,
  createApiClientErrorFromEnvelope,
} from "./api-policy-gate.error";
import {
  buildWorkspaceScopeHeaders,
  type WorkspaceApiScope,
} from "./api-scope-headers.client";

const DASHBOARD_LAYOUT_API_PATH = "/api/internal/v1/workspace/dashboard-layout";

function buildDashboardLayoutRequestInit(
  scope: WorkspaceApiScope,
  init: RequestInit
): RequestInit {
  return {
    ...init,
    cache: "no-store",
    headers: {
      ...buildWorkspaceScopeHeaders(scope),
      ...(init.headers ?? {}),
    },
  };
}

export async function fetchWorkspaceDashboardLayout(
  scope: WorkspaceApiScope
): Promise<DashboardLayoutResponseDto> {
  const response = await fetch(
    DASHBOARD_LAYOUT_API_PATH,
    buildDashboardLayoutRequestInit(scope, { method: "GET" })
  );

  const envelope = await readApiEnvelope<DashboardLayoutResponseDto>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Failed to load workspace dashboard layout."
    );
  }

  return assertApiSuccessEnvelope(
    envelope,
    "Failed to load workspace dashboard layout."
  );
}

export async function saveWorkspaceDashboardLayout(
  scope: WorkspaceApiScope,
  layout: DashboardLayoutPresetDto
): Promise<DashboardLayoutResponseDto> {
  const response = await fetch(
    DASHBOARD_LAYOUT_API_PATH,
    buildDashboardLayoutRequestInit(scope, {
      body: JSON.stringify(layout),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    })
  );

  const envelope = await readApiEnvelope<DashboardLayoutResponseDto>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Failed to save workspace dashboard layout."
    );
  }

  return assertApiSuccessEnvelope(
    envelope,
    "Failed to save workspace dashboard layout."
  );
}

export async function resetWorkspaceDashboardLayoutApi(
  scope: WorkspaceApiScope
): Promise<void> {
  const response = await fetch(
    DASHBOARD_LAYOUT_API_PATH,
    buildDashboardLayoutRequestInit(scope, { method: "DELETE" })
  );

  const envelope = await readApiEnvelope<{ readonly reset: true }>(response);

  if (!response.ok) {
    throw createApiClientErrorFromEnvelope(
      envelope,
      "Failed to reset workspace dashboard layout."
    );
  }

  assertApiSuccessEnvelope(
    envelope,
    "Failed to reset workspace dashboard layout."
  );
}
