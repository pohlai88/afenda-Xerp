import type {
  AuditEventInsertRow,
  WriteAuditEventResult,
} from "@afenda/observability";
import { describe, expect, it } from "vitest";
import {
  createExecutionContext,
  createExecutionFailure,
  createExecutionRegistry,
  createExecutionService,
  createTriggerExecutionProvider,
  EXECUTION_AUDIT_ACTIONS,
} from "../index.js";

function createAuditAdapter(writtenRows: AuditEventInsertRow[]) {
  return {
    write(row: AuditEventInsertRow): Promise<WriteAuditEventResult> {
      writtenRows.push(row);
      return Promise.resolve({ id: `audit-${writtenRows.length}` });
    },
  };
}

describe("execution service", () => {
  const context = createExecutionContext({
    actorId: "actor-1",
    companyId: "company-1",
    correlationId: "corr-exec-001",
    executionId: "exec-service-001",
    organizationId: "organization-1",
    source: "api",
    startedAt: "2026-06-20T00:00:00.000Z",
    tenantId: "tenant-1",
  });

  it("returns provider_unavailable before a provider is configured", async () => {
    const registry = createExecutionRegistry();
    registry.registerWorkflow({
      triggerTaskId: "foundation.unavailable",
      workflowId: "foundation.unavailable",
    });

    const service = createExecutionService({ registry });
    const result = await service.execute({
      context,
      workflowId: "foundation.unavailable",
    });

    expect(result.status).toBe("provider_unavailable");
  });

  it("executes a registered workflow through the provider", async () => {
    const registry = createExecutionRegistry();
    registry.registerWorkflow({
      kind: "manual",
      triggerTaskId: "foundation.health-check",
      workflowId: "foundation.health-check",
    });

    const provider = createTriggerExecutionProvider({ secretKey: null });
    const service = createExecutionService({ provider, registry });

    const result = await service.execute({
      context,
      payload: { ping: true },
      workflowId: "foundation.health-check",
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value.workflowId).toBe("foundation.health-check");
    expect(result.value.kind).toBe("manual");
    expect(result.value.status).toBe("retrying");
    expect(result.value.providerRunId).toContain("local-");
  });

  it("returns workflow_not_registered for unknown workflows", async () => {
    const provider = createTriggerExecutionProvider({ secretKey: null });
    const service = createExecutionService({ provider });

    const result = await service.execute({
      context,
      workflowId: "unknown.workflow",
    });

    expect(result.status).toBe("workflow_not_registered");
  });

  it("enters retrying state when retry policy allows", async () => {
    const registry = createExecutionRegistry();
    registry.registerWorkflow({
      retryPolicy: { backoffMs: 100, maxAttempts: 3 },
      triggerTaskId: "foundation.retry",
      workflowId: "foundation.retry",
    });

    const provider = createTriggerExecutionProvider({ secretKey: null });
    const service = createExecutionService({ provider, registry });

    const started = await service.execute({
      context,
      workflowId: "foundation.retry",
    });

    expect(started.status).toBe("success");

    if (started.status !== "success") {
      return;
    }

    const retried = await service.retry({
      context,
      executionId: started.value.executionId,
      workflowId: "foundation.retry",
    });

    expect(retried.status).toBe("success");

    if (retried.status !== "success") {
      return;
    }

    expect(retried.value.status).toBe("retrying");
    expect(retried.value.kind).toBe("retry");
  });

  it("creates schedules using execution contracts", async () => {
    const registry = createExecutionRegistry();
    registry.registerWorkflow({
      triggerTaskId: "foundation.scheduled",
      workflowId: "foundation.scheduled",
    });

    const provider = createTriggerExecutionProvider({ secretKey: null });
    const service = createExecutionService({ provider, registry });

    const result = await service.schedule({
      context,
      schedule: {
        scheduleId: "daily-check",
        scheduleKind: "daily",
        workflowId: "foundation.scheduled",
      },
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value.scheduleKind).toBe("cron");
    expect(result.value.cron).toBe("0 0 * * *");
  });

  it("cancels executions and reports status", async () => {
    const registry = createExecutionRegistry();
    registry.registerWorkflow({
      triggerTaskId: "foundation.cancel",
      workflowId: "foundation.cancel",
    });

    const provider = createTriggerExecutionProvider({ secretKey: null });
    const service = createExecutionService({ provider, registry });

    const started = await service.execute({
      context,
      workflowId: "foundation.cancel",
    });

    expect(started.status).toBe("success");

    if (started.status !== "success") {
      return;
    }

    const cancelled = await service.cancel({
      context,
      executionId: started.value.executionId,
    });

    expect(cancelled.status).toBe("success");

    const status = await service.getStatus({
      context,
      executionId: started.value.executionId,
    });

    expect(status.status).toBe("success");

    if (status.status !== "success") {
      return;
    }

    expect(status.value.status).toBe("cancelled");
  });
});

describe("execution service audit integration", () => {
  it("emits execution and workflow audit actions through TIP-010", async () => {
    const writtenRows: AuditEventInsertRow[] = [];
    const registry = createExecutionRegistry();
    registry.registerWorkflow({
      triggerTaskId: "foundation.audit",
      workflowId: "foundation.audit",
    });

    const provider = createTriggerExecutionProvider({ secretKey: null });
    const service = createExecutionService({
      auditAdapter: createAuditAdapter(writtenRows),
      provider,
      registry,
    });

    const context = createExecutionContext({
      correlationId: "corr-audit-001",
      executionId: "exec-audit-001",
      source: "manual",
      tenantId: "tenant-1",
    });

    await service.execute({
      context,
      workflowId: "foundation.audit",
    });

    const actions = writtenRows.map((row) => row.action);

    expect(actions).toContain(EXECUTION_AUDIT_ACTIONS.WORKFLOW_STARTED);
    expect(actions).toContain(EXECUTION_AUDIT_ACTIONS.EXECUTION_STARTED);
    expect(writtenRows.every((row) => row.module === "execution")).toBe(true);
    expect(
      writtenRows.every((row) => row.correlationId === "corr-audit-001")
    ).toBe(true);
  });

  it("emits workflow.failed and execution.failed when provider returns failure", async () => {
    const writtenRows: AuditEventInsertRow[] = [];
    const registry = createExecutionRegistry();
    registry.registerWorkflow({
      triggerTaskId: "foundation.audit-fail",
      workflowId: "foundation.audit-fail",
    });

    const provider = {
      providerId: "trigger" as const,
      cancel: () =>
        Promise.resolve(createExecutionFailure("provider_error", "fail")),
      execute: () =>
        Promise.resolve(createExecutionFailure("provider_error", "fail")),
      getStatus: () =>
        Promise.resolve(createExecutionFailure("provider_error", "fail")),
      healthCheck: () =>
        Promise.resolve(createExecutionFailure("provider_error", "fail")),
      retry: () =>
        Promise.resolve(createExecutionFailure("provider_error", "fail")),
      schedule: () =>
        Promise.resolve(createExecutionFailure("provider_error", "fail")),
    };

    const service = createExecutionService({
      auditAdapter: createAuditAdapter(writtenRows),
      provider,
      registry,
    });

    const context = createExecutionContext({
      correlationId: "corr-audit-fail",
      executionId: "exec-audit-fail",
      source: "manual",
    });

    const result = await service.execute({
      context,
      workflowId: "foundation.audit-fail",
    });

    expect(result.status).toBe("provider_error");

    const actions = writtenRows.map((row) => row.action);
    expect(actions).toContain(EXECUTION_AUDIT_ACTIONS.WORKFLOW_FAILED);
    expect(actions).toContain(EXECUTION_AUDIT_ACTIONS.EXECUTION_FAILED);
  });
});

describe("execution context propagation", () => {
  it("requires correlation and execution identifiers at the brand boundary", () => {
    expect(() =>
      createExecutionContext({
        correlationId: "",
        source: "api",
      })
    ).toThrow("correlationId");

    expect(() =>
      createExecutionContext({
        correlationId: "corr-1",
        executionId: "",
        source: "api",
      })
    ).toThrow("executionId");
  });
});
