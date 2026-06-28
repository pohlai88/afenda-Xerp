import type { ExecutionJsonObject } from "@afenda/execution";
import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import { enqueueOutboxEvent } from "../enqueue-outbox-event.server.js";

const VALID_CORRELATION_ID = createTestEnterpriseId("correlation");

describe("enqueueOutboxEvent", () => {
  it("rejects non-canonical correlationId before persistence", async () => {
    await expect(
      enqueueOutboxEvent({
        actorId: "actor-1",
        companyId: "company-1",
        correlationId: "corr-1",
        eventType: "workspace.dashboard.layout.updated",
        payload: { ok: true },
        tenantId: "tenant-1",
      })
    ).rejects.toMatchObject({
      code: "validation_failed",
      message: expect.stringContaining("correlationId"),
    });
  });

  it("rejects non-serializable metadata before persistence", async () => {
    const invalidMetadata = { invalid: () => undefined };

    await expect(
      enqueueOutboxEvent({
        actorId: "actor-1",
        companyId: "company-1",
        correlationId: VALID_CORRELATION_ID,
        eventType: "workspace.dashboard.layout.updated",
        metadata: invalidMetadata as unknown as ExecutionJsonObject,
        payload: { ok: true },
        tenantId: "tenant-1",
      })
    ).rejects.toMatchObject({
      code: "validation_failed",
    });
  });

  it("rejects empty company scope before persistence", async () => {
    await expect(
      enqueueOutboxEvent({
        actorId: "actor-1",
        companyId: "   ",
        correlationId: VALID_CORRELATION_ID,
        eventType: "workspace.dashboard.layout.updated",
        payload: { ok: true },
        tenantId: "tenant-1",
      })
    ).rejects.toBeInstanceOf(ApiRouteError);
  });

  it("stores internal tenant PK in metadata when tenantId is not canonical", async () => {
    const tenantPk = "018f9f8c-9f1a-7c2b-9c20-000000000099";
    const captured: Record<string, unknown>[] = [];

    const db = {
      insert: () => ({
        values: (row: Record<string, unknown>) => {
          captured.push(row);
          return {
            returning: async () => [{ id: "row-1" }],
          };
        },
      }),
    };

    await enqueueOutboxEvent(
      {
        actorId: "actor-1",
        companyId: "company-1",
        correlationId: VALID_CORRELATION_ID,
        eventType: "workspace.dashboard.layout.updated",
        payload: { ok: true },
        tenantId: tenantPk,
      },
      db as never
    );

    expect(captured[0]?.["metadata"]).toEqual(
      expect.objectContaining({ tenantPk })
    );
    expect(captured[0]?.["correlationId"]).toBe(VALID_CORRELATION_ID);
  });
});
