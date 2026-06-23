import type { ExecutionJsonObject } from "@afenda/execution";
import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import { enqueueOutboxEvent } from "../enqueue-outbox-event.server.js";

describe("enqueueOutboxEvent", () => {
  it("rejects non-serializable metadata before persistence", async () => {
    const invalidMetadata = { invalid: () => undefined };

    await expect(
      enqueueOutboxEvent({
        actorId: "actor-1",
        companyId: "company-1",
        correlationId: "corr-1",
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
        correlationId: "corr-1",
        eventType: "workspace.dashboard.layout.updated",
        payload: { ok: true },
        tenantId: "tenant-1",
      })
    ).rejects.toBeInstanceOf(ApiRouteError);
  });
});
