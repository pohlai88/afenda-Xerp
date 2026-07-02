import type { DashboardLayoutResponseDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

import { readApiEnvelope } from "./api-envelope.client";
import {
  assertApiSuccessEnvelope,
  createApiClientErrorFromEnvelope,
} from "./api-policy-gate.error";
import {
  buildWorkspaceScopeHeaders,
  type WorkspaceApiScope,
} from "./api-scope-headers.client";
import { INTERNAL_V1_WORKSPACE_DASHBOARD_LAYOUT_PATH } from "./internal-v1-workspace-routes";

export async function fetchWorkspaceDashboardLayout(
  scope: WorkspaceApiScope
): Promise<DashboardLayoutResponseDto> {
  const response = await fetch(INTERNAL_V1_WORKSPACE_DASHBOARD_LAYOUT_PATH, {
    cache: "no-store",
    headers: buildWorkspaceScopeHeaders(scope),
    method: "GET",
  });

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
