import type {
  DashboardLayoutPresetDto,
  DashboardLayoutResponseDto,
} from "@/server/api/contracts/workspace/dashboard-layout.api-contract";

const DASHBOARD_LAYOUT_API_PATH = "/api/internal/v1/workspace/dashboard-layout";

interface ApiEnvelope<TData> {
  readonly data?: TData;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
  readonly ok: boolean;
}

async function parseApiEnvelope<TData>(
  response: Response
): Promise<ApiEnvelope<TData>> {
  const payload: unknown = await response.json();

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("ok" in payload) ||
    typeof payload.ok !== "boolean"
  ) {
    throw new Error("Invalid API response envelope.");
  }

  return payload as ApiEnvelope<TData>;
}

export async function fetchWorkspaceDashboardLayout(): Promise<DashboardLayoutResponseDto> {
  const response = await fetch(DASHBOARD_LAYOUT_API_PATH, {
    cache: "no-store",
    method: "GET",
  });

  const envelope = await parseApiEnvelope<DashboardLayoutResponseDto>(response);

  if (!response.ok || !envelope.ok || envelope.data === undefined) {
    throw new Error(
      envelope.error?.message ?? "Failed to load workspace dashboard layout."
    );
  }

  return envelope.data;
}

export async function saveWorkspaceDashboardLayout(
  layout: DashboardLayoutPresetDto
): Promise<DashboardLayoutResponseDto> {
  const response = await fetch(DASHBOARD_LAYOUT_API_PATH, {
    body: JSON.stringify(layout),
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
  });

  const envelope = await parseApiEnvelope<DashboardLayoutResponseDto>(response);

  if (!response.ok || !envelope.ok || envelope.data === undefined) {
    throw new Error(
      envelope.error?.message ?? "Failed to save workspace dashboard layout."
    );
  }

  return envelope.data;
}

export async function resetWorkspaceDashboardLayoutApi(): Promise<void> {
  const response = await fetch(DASHBOARD_LAYOUT_API_PATH, {
    cache: "no-store",
    method: "DELETE",
  });

  const envelope = await parseApiEnvelope<{ readonly reset: true }>(response);

  if (!response.ok || !envelope.ok) {
    throw new Error(
      envelope.error?.message ?? "Failed to reset workspace dashboard layout."
    );
  }
}
