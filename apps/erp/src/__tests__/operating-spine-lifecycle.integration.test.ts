import { DEFAULT_DASHBOARD_LAYOUT } from "@afenda/appshell";
import {
  createExecutionContext,
  createOutboxPublishService,
  runPublishOutboxEventsJob,
} from "@afenda/execution";
import { brandUserId, unbrand } from "@afenda/kernel";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { describe, expect, it, vi } from "vitest";
import {
  resolveRoutePermissionRequirement,
  resolveRouteProtectionLevel,
} from "@/lib/api/api-route-permissions";
import { assertAuthorizedApiRoute } from "@/lib/api/authorize-api-route";
import { commitWorkspaceDashboardMutation } from "@/lib/outbox/commit-workspace-dashboard-mutation.server.js";
import type { EnqueueOutboxEventInput } from "@/lib/outbox/enqueue-outbox-event.server.js";
import { createInMemoryOutboxPersistence } from "@/lib/outbox/in-memory-outbox-persistence.js";
import { PROTECTED_MUTATION_SPINE_PHASES } from "@/lib/spine/protected-mutation-spine.contract.js";
import { runProtectedMutation } from "@/lib/spine/run-protected-mutation.js";
import {
  createDashboardRbacOperatingContextFixture,
  createDashboardRbacOperatingContextResolver,
  DASHBOARD_RBAC_ACTOR_ID,
  DASHBOARD_RBAC_COMPANY_ID,
  DASHBOARD_RBAC_TENANT_ID,
  seedDashboardRbacAuthorizationStore,
} from "@/lib/workspace/__tests__/dashboard-rbac.fixture";
import { dashboardLayoutPutContract } from "@/server/api/contracts/workspace/dashboard-layout.contract";
import { createApiRequestContext } from "@/server/api/runtime/api-request-context";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { clearWorkspaceDashboardLayoutStoreForTests } from "@/server/workspace/dashboard-layout.service";

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

describe("operating spine lifecycle", () => {
  it("defines all mandatory spine phases", () => {
    expect(PROTECTED_MUTATION_SPINE_PHASES).toEqual([
      "validation",
      "authorization",
      "policy",
      "execution",
      "audit",
      "observability",
      "event_publication",
    ]);
  });

  it("runs dashboard mutation through spine with scoped outbox publication", async () => {
    clearWorkspaceDashboardLayoutStoreForTests();

    const persistence = createInMemoryOutboxPersistence();
    const enqueue = createInMemoryEnqueue(persistence);
    const correlationId = "corr-spine-lifecycle-001";

    const operatingContext = createDashboardRbacOperatingContextFixture();
    const execution = createExecutionContext({
      actorId: DASHBOARD_RBAC_ACTOR_ID,
      companyId: DASHBOARD_RBAC_COMPANY_ID,
      correlationId,
      source: "api",
      tenantId: DASHBOARD_RBAC_TENANT_ID,
    });

    const context = createApiRequestContext({
      authorization: null,
      authorizationDecision: null,
      contract: dashboardLayoutPutContract,
      correlationId,
      execution,
      operatingContext,
      request: new Request(
        "http://localhost/api/internal/v1/workspace/dashboard-layout",
        { method: "PUT" }
      ),
      requestBody: DEFAULT_DASHBOARD_LAYOUT,
      requestId: "req-spine-lifecycle-001",
      session: null,
      userId: brandUserId(DASHBOARD_RBAC_ACTOR_ID),
    });

    const observability = vi.fn();

    const spineResult = await runProtectedMutation({
      context,
      execute: async (scope) =>
        commitWorkspaceDashboardMutation(
          {
            actorId: scope.actorId,
            companyId: scope.companyId,
            correlationId: scope.correlationId,
            eventId: "evt-spine-lifecycle-001",
            layout: DEFAULT_DASHBOARD_LAYOUT,
            organizationId: scope.organizationId,
            tenantId: scope.tenantId,
            userId: unbrand(scope.userId),
          },
          enqueue
        ),
      onObservability: observability,
    });

    expect(observability).toHaveBeenCalledWith(
      expect.objectContaining({
        correlationId,
        scope: expect.objectContaining({
          companyId: DASHBOARD_RBAC_COMPANY_ID,
          tenantId: DASHBOARD_RBAC_TENANT_ID,
        }),
      })
    );

    expect(spineResult.result.layout).toEqual(DEFAULT_DASHBOARD_LAYOUT);
    expect(persistence.records.size).toBe(1);

    const dispatch = vi.fn(async () => ({ ok: true as const }));
    const publishService = createOutboxPublishService({
      dispatcher: { dispatch },
      nowIso: () => "2026-06-23T12:00:00.000Z",
      persistence,
    });

    const publishResult = await runPublishOutboxEventsJob(publishService, {
      tenantId: DASHBOARD_RBAC_TENANT_ID,
    });

    expect(publishResult.status).toBe("success");

    if (publishResult.status !== "success") {
      return;
    }

    expect(publishResult.value.published).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("forbidden authorization does not run spine execution or enqueue outbox rows", async () => {
    const persistence = createInMemoryOutboxPersistence();

    const request = new Request(
      "http://localhost/api/internal/v1/workspace/dashboard-layout",
      { method: "PUT" }
    );

    await expect(
      assertAuthorizedApiRoute(
        {
          actorId: DASHBOARD_RBAC_ACTOR_ID,
          correlationId: "corr-spine-forbidden",
          method: dashboardLayoutPutContract.method,
          path: dashboardLayoutPutContract.path,
          permission: resolveRoutePermissionRequirement(
            PERMISSION_REGISTRY.workspace.dashboard.write
          ),
          protectionLevel: resolveRouteProtectionLevel(
            dashboardLayoutPutContract
          ),
          request,
        },
        {
          permission: seedDashboardRbacAuthorizationStore([]),
          resolveOperatingContext:
            createDashboardRbacOperatingContextResolver(),
        }
      )
    ).rejects.toBeInstanceOf(ApiRouteError);

    expect(persistence.records.size).toBe(0);
  });
});
