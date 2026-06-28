import type {
  AuditEventInsertRow,
  WriteAuditEventResult,
} from "@afenda/observability";
import { describe, expect, it, vi } from "vitest";
import type {
  ClaimOutboxEventsInput,
  MarkOutboxDeadLetterInput,
  MarkOutboxFailedInput,
  MarkOutboxPublishedInput,
  OutboxEventDispatcher,
  OutboxEventEnvelope,
  OutboxEventRecord,
  OutboxPersistencePort,
  ReleaseOutboxClaimInput,
} from "../contracts/outbox-event.contract.js";
import {
  OUTBOX_EVENT_VERSION,
  OUTBOX_STATUSES,
  toOutboxEventEnvelope,
} from "../contracts/outbox-event.contract.js";
import {
  createExecutionRegistry,
  createOutboxPublishService,
  createPublishOutboxEventsScheduleDefinition,
  isExecutionPayload,
  OUTBOX_AUDIT_ACTIONS,
  PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID,
  registerPublishOutboxEventsWorkflow,
  runPublishOutboxEventsJob,
} from "../index.js";
import {
  EXECUTION_TEST_ACTOR_ID,
  EXECUTION_TEST_COMPANY_ID,
  EXECUTION_TEST_CORRELATION_ID,
  EXECUTION_TEST_FIXTURE_GENERATOR,
  EXECUTION_TEST_ORGANIZATION_ID,
  EXECUTION_TEST_TENANT_B_ID,
  EXECUTION_TEST_TENANT_ID,
} from "./execution-test-fixtures.js";

const fixtureCanonicalIdBodyGenerator = EXECUTION_TEST_FIXTURE_GENERATOR;

function createAuditAdapter(writtenRows: AuditEventInsertRow[]) {
  return {
    write(row: AuditEventInsertRow): Promise<WriteAuditEventResult> {
      writtenRows.push(row);
      return Promise.resolve({ id: `audit-${writtenRows.length}` });
    },
  };
}

function createPendingRecord(
  overrides: Partial<OutboxEventRecord> = {}
): OutboxEventRecord {
  return {
    actorId: EXECUTION_TEST_ACTOR_ID,
    actorType: "system",
    attempts: 0,
    availableAt: "2026-06-23T00:00:00.000Z",
    causationId: null,
    companyId: EXECUTION_TEST_COMPANY_ID,
    correlationId: EXECUTION_TEST_CORRELATION_ID,
    eventId: "evt-001",
    eventType: "workspace.updated",
    eventVersion: OUTBOX_EVENT_VERSION,
    executionRunId: null,
    id: "row-001",
    lockedAt: null,
    lockedBy: null,
    maxAttempts: 3,
    metadata: { source: "test" },
    organizationId: EXECUTION_TEST_ORGANIZATION_ID,
    payload: { label: "dashboard" },
    reason: null,
    status: "pending",
    summary: null,
    tenantId: EXECUTION_TEST_TENANT_ID,
    ...overrides,
  };
}

type MutableOutboxRecord = OutboxEventRecord & {
  failedAt?: string;
  lastError?: string;
  publishedAt?: string;
};

function createInMemoryOutboxPersistence(
  initial: readonly OutboxEventRecord[] = []
): OutboxPersistencePort & {
  readonly records: Map<string, MutableOutboxRecord>;
} {
  const records = new Map(
    initial.map((record) => [record.id, { ...record } as MutableOutboxRecord])
  );

  return {
    records,
    claimPending(input: ClaimOutboxEventsInput) {
      const claimed: MutableOutboxRecord[] = [];

      for (const record of records.values()) {
        if (claimed.length >= input.limit) {
          break;
        }

        if (record.status !== "pending") {
          continue;
        }

        if (record.availableAt > input.nowIso) {
          continue;
        }

        if (
          input.tenantId !== undefined &&
          input.tenantId !== null &&
          record.tenantId !== input.tenantId
        ) {
          continue;
        }

        const locked: MutableOutboxRecord = {
          ...record,
          lockedAt: input.nowIso,
          lockedBy: input.lockedBy,
          status: "processing",
        };

        records.set(record.id, locked);
        claimed.push(locked);
      }

      return Promise.resolve(claimed);
    },
    markPublished(input: MarkOutboxPublishedInput) {
      const existing = records.get(input.id);

      if (!existing) {
        return Promise.resolve();
      }

      records.set(input.id, {
        ...existing,
        lockedAt: null,
        lockedBy: null,
        publishedAt: input.publishedAt,
        status: "published",
      });

      return Promise.resolve();
    },
    markFailed(input: MarkOutboxFailedInput) {
      const existing = records.get(input.id);

      if (!existing) {
        return Promise.resolve();
      }

      records.set(input.id, {
        ...existing,
        attempts: input.attempts,
        availableAt: input.availableAt,
        failedAt: input.failedAt,
        lastError: input.lastError,
        lockedAt: null,
        lockedBy: null,
        status: "failed",
      });

      return Promise.resolve();
    },
    markDeadLetter(input: MarkOutboxDeadLetterInput) {
      const existing = records.get(input.id);

      if (!existing) {
        return Promise.resolve();
      }

      records.set(input.id, {
        ...existing,
        failedAt: input.failedAt,
        lastError: input.lastError,
        lockedAt: null,
        lockedBy: null,
        status: "dead_letter",
      });

      return Promise.resolve();
    },
    releaseClaim(input: ReleaseOutboxClaimInput) {
      const existing = records.get(input.id);

      if (!existing) {
        return Promise.resolve();
      }

      records.set(input.id, {
        ...existing,
        availableAt: input.availableAt,
        lockedAt: null,
        lockedBy: null,
        status: "pending",
      });

      return Promise.resolve();
    },
  };
}

describe("outbox event contract", () => {
  it("defines outbox statuses aligned with database enum", () => {
    expect(OUTBOX_STATUSES).toEqual([
      "pending",
      "processing",
      "published",
      "failed",
      "dead_letter",
    ]);
  });

  it("maps a persisted record to a serializable envelope", () => {
    const record = createPendingRecord();
    const envelope = toOutboxEventEnvelope(record, {
      canonicalIdBodyGenerator: fixtureCanonicalIdBodyGenerator,
    });

    expect(envelope.eventId).toBe("evt-001");
    expect(envelope.eventType).toBe("workspace.updated");
    expect(envelope.executionContext.tenantId).toBe(EXECUTION_TEST_TENANT_ID);
    expect(isExecutionPayload(envelope.payload)).toBe(true);

    const serialized = JSON.stringify(envelope);
    const parsed = JSON.parse(serialized) as OutboxEventEnvelope;

    expect(parsed.correlationId).toBe(EXECUTION_TEST_CORRELATION_ID);
  });
});

describe("outbox publish service", () => {
  it("returns provider_unavailable when persistence is not wired", async () => {
    const dispatcher: OutboxEventDispatcher = {
      dispatch: vi.fn(),
    };

    const service = createOutboxPublishService({
      canonicalIdBodyGenerator: fixtureCanonicalIdBodyGenerator,
      dispatcher,
      persistence: null,
    });

    const result = await service.publishBatch({
      lockedBy: "test-worker",
    });

    expect(result.status).toBe("provider_unavailable");
  });

  it("dispatches a claimed event exactly once and marks it published", async () => {
    const persistence = createInMemoryOutboxPersistence([
      createPendingRecord(),
    ]);
    const dispatch = vi.fn(async (_envelope: OutboxEventEnvelope) => ({
      ok: true as const,
    }));

    const service = createOutboxPublishService({
      canonicalIdBodyGenerator: fixtureCanonicalIdBodyGenerator,
      dispatcher: { dispatch },
      nowIso: () => "2026-06-23T01:00:00.000Z",
      persistence,
    });

    const result = await service.publishBatch({
      lockedBy: "worker-a",
      tenantId: EXECUTION_TEST_TENANT_ID,
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value).toEqual({
      claimed: 1,
      deadLetter: 0,
      failed: 0,
      published: 1,
      skipped: 0,
    });
    expect(dispatch).toHaveBeenCalledTimes(1);

    const stored = persistence.records.get("row-001");

    expect(stored?.status).toBe("published");
    expect(stored?.lockedBy).toBeNull();
  });

  it("does not claim or dispatch rows outside the tenant scope", async () => {
    const persistence = createInMemoryOutboxPersistence([
      createPendingRecord({ id: "row-a", tenantId: EXECUTION_TEST_TENANT_ID }),
      createPendingRecord({
        eventId: "evt-b",
        id: "row-b",
        tenantId: EXECUTION_TEST_TENANT_B_ID,
      }),
    ]);
    const dispatch = vi.fn(async () => ({ ok: true as const }));

    const service = createOutboxPublishService({
      canonicalIdBodyGenerator: fixtureCanonicalIdBodyGenerator,
      dispatcher: { dispatch },
      nowIso: () => "2026-06-23T01:00:00.000Z",
      persistence,
    });

    const result = await service.publishBatch({
      limit: 10,
      lockedBy: "worker-a",
      tenantId: EXECUTION_TEST_TENANT_ID,
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value.published).toBe(1);
    expect(result.value.claimed).toBe(1);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(persistence.records.get("row-b")?.status).toBe("pending");
  });

  it("marks dead letter when dispatch fails beyond max attempts", async () => {
    const persistence = createInMemoryOutboxPersistence([
      createPendingRecord({ attempts: 2, maxAttempts: 3 }),
    ]);
    const dispatch = vi.fn(async () => ({
      error: "downstream unavailable",
      ok: false as const,
    }));

    const service = createOutboxPublishService({
      canonicalIdBodyGenerator: fixtureCanonicalIdBodyGenerator,
      dispatcher: { dispatch },
      nowIso: () => "2026-06-23T01:00:00.000Z",
      persistence,
    });

    const result = await service.publishBatch({
      lockedBy: "worker-a",
      tenantId: EXECUTION_TEST_TENANT_ID,
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value.deadLetter).toBe(1);
    expect(persistence.records.get("row-001")?.status).toBe("dead_letter");
  });

  it("emits batch-completion audit evidence when auditAdapter is wired", async () => {
    const writtenRows: AuditEventInsertRow[] = [];
    const persistence = createInMemoryOutboxPersistence([
      createPendingRecord(),
    ]);
    const dispatch = vi.fn(async () => ({ ok: true as const }));

    const service = createOutboxPublishService({
      canonicalIdBodyGenerator: fixtureCanonicalIdBodyGenerator,
      auditAdapter: createAuditAdapter(writtenRows),
      dispatcher: { dispatch },
      nowIso: () => "2026-06-23T01:00:00.000Z",
      persistence,
    });

    const result = await service.publishBatch({
      lockedBy: PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID,
      tenantId: EXECUTION_TEST_TENANT_ID,
    });

    expect(result.status).toBe("success");
    expect(writtenRows).toHaveLength(1);
    expect(writtenRows[0]?.action).toBe(
      OUTBOX_AUDIT_ACTIONS.OUTBOX_BATCH_COMPLETED
    );
    expect(writtenRows[0]?.module).toBe("execution");
    expect(writtenRows[0]?.targetType).toBe("outbox_batch");
    expect(writtenRows[0]?.metadata).toEqual(
      expect.objectContaining({
        claimed: 1,
        deadLetter: 0,
        failed: 0,
        published: 1,
        skipped: 0,
      })
    );
    expect(writtenRows[0]?.tenantId).toBe(EXECUTION_TEST_TENANT_ID);
  });

  it("does not emit audit evidence when auditAdapter is omitted", async () => {
    const persistence = createInMemoryOutboxPersistence([
      createPendingRecord(),
    ]);
    const dispatch = vi.fn(async () => ({ ok: true as const }));

    const service = createOutboxPublishService({
      canonicalIdBodyGenerator: fixtureCanonicalIdBodyGenerator,
      dispatcher: { dispatch },
      nowIso: () => "2026-06-23T01:00:00.000Z",
      persistence,
    });

    const result = await service.publishBatch({
      lockedBy: "worker-a",
      tenantId: EXECUTION_TEST_TENANT_ID,
    });

    expect(result.status).toBe("success");
  });
});

describe("publish outbox events job", () => {
  it("registers the Trigger.dev workflow id", () => {
    const registry = createExecutionRegistry();
    const registered = registerPublishOutboxEventsWorkflow(registry);

    expect(registered.status).toBe("success");

    if (registered.status !== "success") {
      return;
    }

    expect(registered.value.workflowId).toBe(PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID);
    expect(registered.value.kind).toBe("job");
  });

  it("defines a cron schedule for outbox polling", () => {
    const schedule = createPublishOutboxEventsScheduleDefinition();

    expect(schedule.scheduleKind).toBe("cron");
    expect(schedule.cron).toBe("*/5 * * * *");
    expect(schedule.workflowId).toBe(PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID);
  });

  it("runs a publish batch through the job helper", async () => {
    const persistence = createInMemoryOutboxPersistence([
      createPendingRecord(),
    ]);
    const service = createOutboxPublishService({
      canonicalIdBodyGenerator: fixtureCanonicalIdBodyGenerator,
      dispatcher: {
        dispatch: vi.fn(async () => ({ ok: true as const })),
      },
      nowIso: () => "2026-06-23T01:00:00.000Z",
      persistence,
    });

    const result = await runPublishOutboxEventsJob(service, {
      tenantId: EXECUTION_TEST_TENANT_ID,
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value.published).toBe(1);
  });
});
