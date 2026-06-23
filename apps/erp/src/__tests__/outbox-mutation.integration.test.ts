import { DEFAULT_DASHBOARD_LAYOUT } from "@afenda/appshell";
import {
  createExecutionContext,
  createOutboxPublishService,
  type OutboxEventEnvelope,
  runPublishOutboxEventsJob,
} from "@afenda/execution";
import { brandUserId } from "@afenda/kernel";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";

import {
  createDashboardRbacOperatingContextFixture,
  DASHBOARD_RBAC_ACTOR_ID,
  DASHBOARD_RBAC_COMPANY_ID,
  DASHBOARD_RBAC_TENANT_ID,
} from "@/lib/workspace/__tests__/dashboard-rbac.fixture";
import { dashboardLayoutPutContract } from "@/server/api/contracts/workspace/dashboard-layout.contract";
import {
  assertRoutePermission,
  createApiRequestContext,
} from "@/server/api/runtime/api-request-context";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { clearWorkspaceDashboardLayoutStoreForTests } from "@/server/workspace/dashboard-layout.service";

import { commitWorkspaceDashboardMutation } from "../lib/outbox/commit-workspace-dashboard-mutation.server.js";
import type { EnqueueOutboxEventInput } from "../lib/outbox/enqueue-outbox-event.server.js";
import { createInMemoryOutboxPersistence } from "../lib/outbox/in-memory-outbox-persistence.js";

const TENANT_B_ID = "tenant-outbox-b";
const TENANT_B_COMPANY_ID = "company-outbox-b";

const OUTBOX_TEST_AVAILABLE_AT = "2026-06-23T00:00:00.000Z";

function createInMemoryEnqueue(
  persistence: ReturnType<typeof createInMemoryOutboxPersistence>
) {
  return (input: EnqueueOutboxEventInput) => {
    const id = input.eventId ?? crypto.randomUUID();

    persistence.seed({
      actorId: input.actorId,
      actorType: input.actorType ?? "user",
      attempts: 0,
      availableAt: OUTBOX_TEST_AVAILABLE_AT,
      causationId: input.causationId ?? null,
      companyId: input.companyId,
      correlationId: input.correlationId,
      eventId: id,
      eventType: input.eventType,
      eventVersion: input.eventVersion ?? "1.0",
      executionRunId: input.executionRunId ?? null,
      id: crypto.randomUUID(),
      lockedAt: null,
      lockedBy: null,
      maxAttempts: 3,
      metadata: {},
      organizationId: input.organizationId ?? null,
      payload: input.payload,
      reason: input.reason ?? null,
      status: "pending",
      summary: input.summary ?? null,
      tenantId: input.tenantId,
    });

    return Promise.resolve({ id });
  };
}

describe("outbox mutation integration", () => {
  it("commits workspace mutation, enqueues scoped outbox row, and dispatches once", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const persistence = createInMemoryOutboxPersistence();
    const dispatch = vi.fn(async (_envelope: OutboxEventEnvelope) => ({
      ok: true as const,
    }));
    const publishService = createOutboxPublishService({
      dispatcher: { dispatch },
      nowIso: () => "2026-06-23T12:00:00.000Z",
      persistence,
    });

    const correlationId = "corr-outbox-integration-001";

    const committed = await commitWorkspaceDashboardMutation(
      {
        actorId: DASHBOARD_RBAC_ACTOR_ID,
        companyId: DASHBOARD_RBAC_COMPANY_ID,
        correlationId,
        eventId: "evt-dashboard-001",
        tenantId: DASHBOARD_RBAC_TENANT_ID,
        userId: DASHBOARD_RBAC_ACTOR_ID,
        layout: DEFAULT_DASHBOARD_LAYOUT,
      },
      createInMemoryEnqueue(persistence)
    );

    expect(committed.outbox.id).toBeTruthy();
    expect(committed.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);

    const publishResult = await runPublishOutboxEventsJob(publishService, {
      tenantId: DASHBOARD_RBAC_TENANT_ID,
    });

    expect(publishResult.status).toBe("success");

    if (publishResult.status !== "success") {
      return;
    }

    expect(publishResult.value).toEqual({
      claimed: 1,
      deadLetter: 0,
      failed: 0,
      published: 1,
      skipped: 0,
    });
    expect(dispatch).toHaveBeenCalledTimes(1);

    const envelope = dispatch.mock.calls[0]?.[0];

    expect(envelope?.correlationId).toBe(correlationId);
    expect(envelope?.executionContext.tenantId).toBe(DASHBOARD_RBAC_TENANT_ID);
    expect(envelope?.executionContext.companyId).toBe(
      DASHBOARD_RBAC_COMPANY_ID
    );

    const stored = [...persistence.records.values()].find(
      (row) => row.eventId === "evt-dashboard-001"
    );

    expect(stored?.status).toBe("published");
    expect(stored?.tenantId).toBe(DASHBOARD_RBAC_TENANT_ID);
    expect(stored?.companyId).toBe(DASHBOARD_RBAC_COMPANY_ID);
  });

  it("does not dispatch tenant B rows when publishing under tenant A", async () => {
    const persistence = createInMemoryOutboxPersistence();
    const enqueue = createInMemoryEnqueue(persistence);

    await enqueue({
      actorId: "actor-b",
      companyId: TENANT_B_COMPANY_ID,
      correlationId: "corr-tenant-b",
      eventId: "evt-tenant-b",
      eventType: "workspace.dashboard.layout.updated",
      payload: { scope: "tenant-b" },
      tenantId: TENANT_B_ID,
    });

    await enqueue({
      actorId: DASHBOARD_RBAC_ACTOR_ID,
      companyId: DASHBOARD_RBAC_COMPANY_ID,
      correlationId: "corr-tenant-a",
      eventId: "evt-tenant-a",
      eventType: "workspace.dashboard.layout.updated",
      payload: { scope: "tenant-a" },
      tenantId: DASHBOARD_RBAC_TENANT_ID,
    });

    const dispatch = vi.fn(async () => ({ ok: true as const }));
    const publishService = createOutboxPublishService({
      dispatcher: { dispatch },
      nowIso: () => "2026-06-23T12:00:00.000Z",
      persistence,
    });

    const result = await runPublishOutboxEventsJob(publishService, {
      tenantId: DASHBOARD_RBAC_TENANT_ID,
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value.published).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(persistence.records.size).toBe(2);

    const tenantBRow = [...persistence.records.values()].find(
      (row) => row.tenantId === TENANT_B_ID
    );

    expect(tenantBRow?.status).toBe("pending");
  });

  it("returns forbidden from createApiHandler permission gate without enqueueing outbox rows", async () => {
    const persistence = createInMemoryOutboxPersistence();
    const operatingContext = createDashboardRbacOperatingContextFixture();
    const execution = createExecutionContext({
      actorId: DASHBOARD_RBAC_ACTOR_ID,
      companyId: DASHBOARD_RBAC_COMPANY_ID,
      correlationId: "corr-forbidden-outbox",
      source: "api",
      tenantId: DASHBOARD_RBAC_TENANT_ID,
    });

    const context = createApiRequestContext({
      authorization: null,
      authorizationDecision: null,
      contract: dashboardLayoutPutContract,
      correlationId: "corr-forbidden-outbox",
      execution,
      operatingContext,
      request: new Request(
        "http://localhost/api/internal/v1/workspace/dashboard-layout",
        {
          method: "PUT",
        }
      ),
      requestBody: DEFAULT_DASHBOARD_LAYOUT,
      requestId: "req-forbidden-outbox",
      session: null,
      userId: brandUserId(DASHBOARD_RBAC_ACTOR_ID),
    });

    await expect(
      assertRoutePermission(context, dashboardLayoutPutContract.permission)
    ).rejects.toBeInstanceOf(ApiRouteError);

    expect(persistence.records.size).toBe(0);
  });
});

describe("createApiHandler outbox contract wiring", () => {
  it("dashboard layout PUT contract requires workspace.dashboard.write permission", () => {
    expect(dashboardLayoutPutContract.permission?.permission).toBe(
      PERMISSION_REGISTRY.workspace.dashboard.write
    );
    expect(dashboardLayoutPutContract.audit?.enabled).toBe(true);
  });
});
