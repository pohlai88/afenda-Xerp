import { DEFAULT_DASHBOARD_LAYOUT } from "@afenda/appshell";
import type { ExecutionJsonObject, ExecutionPayload } from "@afenda/execution";
import {
  type EnqueueOutboxEventInput,
  type EnqueueOutboxEventResult,
  enqueueOutboxEvent,
} from "@/lib/outbox/enqueue-outbox-event.server";
import type { DashboardLayoutPresetDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";
import { saveWorkspaceDashboardLayout } from "@/server/workspace/dashboard-layout.service";

export const WORKSPACE_DASHBOARD_LAYOUT_UPDATED_EVENT =
  "workspace.dashboard.layout.updated" as const;

export interface CommitWorkspaceDashboardMutationInput {
  readonly actorId: string;
  readonly companyId: string;
  readonly correlationId: string;
  readonly eventId?: string;
  readonly layout?: DashboardLayoutPresetDto;
  readonly organizationId?: string | null;
  readonly tenantId: string;
  readonly userId: string;
}

export interface CommitWorkspaceDashboardMutationResult {
  readonly layout: DashboardLayoutPresetDto;
  readonly outbox: EnqueueOutboxEventResult;
  readonly source: "stored";
  readonly updatedAt: string;
}

function buildDashboardOutboxPayload(
  layout: DashboardLayoutPresetDto,
  userId: string
): ExecutionPayload {
  return {
    layoutVersion: layout.version,
    userId,
    widgetCount: layout.items.length,
  } satisfies ExecutionPayload;
}

export async function commitWorkspaceDashboardMutation(
  input: CommitWorkspaceDashboardMutationInput,
  enqueueFn: (
    enqueueInput: EnqueueOutboxEventInput
  ) => Promise<EnqueueOutboxEventResult> = enqueueOutboxEvent
): Promise<CommitWorkspaceDashboardMutationResult> {
  const layout = input.layout ?? DEFAULT_DASHBOARD_LAYOUT;

  const saved = await saveWorkspaceDashboardLayout(
    input.tenantId,
    input.userId,
    layout
  );

  const outbox = await enqueueFn({
    actorId: input.actorId,
    actorType: "user",
    companyId: input.companyId,
    correlationId: input.correlationId,
    ...(input.eventId === undefined ? {} : { eventId: input.eventId }),
    eventType: WORKSPACE_DASHBOARD_LAYOUT_UPDATED_EVENT,
    metadata: {
      module: "workspace",
      targetType: "dashboard_layout",
    } satisfies ExecutionJsonObject,
    organizationId: input.organizationId ?? null,
    payload: buildDashboardOutboxPayload(saved.layout, input.userId),
    tenantId: input.tenantId,
  });

  return {
    layout: saved.layout,
    outbox,
    source: saved.source,
    updatedAt: saved.updatedAt,
  };
}
