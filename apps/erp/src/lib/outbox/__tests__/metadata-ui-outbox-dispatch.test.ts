import {
  createExecutionContext,
  type OutboxEventEnvelope,
} from "@afenda/execution";
import {
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
} from "@afenda/kernel";
import { describe, expect, it, vi } from "vitest";

import { createMetadataUiOutboxEventDispatcher } from "../metadata-ui-outbox-dispatcher.server.js";

const FIXTURE_GENERATOR = createFixtureCanonicalIdBodyGenerator();

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { revalidatePath } from "next/cache";

function createEnvelope(
  overrides: Partial<OutboxEventEnvelope> = {}
): OutboxEventEnvelope {
  const executionContext = createExecutionContext({
    canonicalIdBodyGenerator: FIXTURE_GENERATOR,
    correlationId: createTestEnterpriseId("correlation"),
    source: "outbox",
  });

  return {
    causationId: null,
    correlationId: executionContext.correlationId,
    eventId: "evt-001",
    eventType: "workspace.dashboard.layout.updated",
    eventVersion: "1.0",
    executionContext,
    metadata: { module: "workspace" },
    payload: { widgetCount: 1 },
    ...overrides,
  };
}

describe("metadata-ui outbox dispatcher", () => {
  it("revalidates workspace layout after metadata refresh events", async () => {
    vi.mocked(revalidatePath).mockClear();

    const inner = vi.fn(async () => ({ ok: true as const }));
    const dispatcher = createMetadataUiOutboxEventDispatcher({
      dispatch: inner,
    });

    const result = await dispatcher.dispatch(createEnvelope());

    expect(result.ok).toBe(true);
    expect(inner).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/workspace", "layout");
  });

  it("does not revalidate for unrelated domain events", async () => {
    vi.mocked(revalidatePath).mockClear();

    const inner = vi.fn(async () => ({ ok: true as const }));
    const dispatcher = createMetadataUiOutboxEventDispatcher({
      dispatch: inner,
    });

    await dispatcher.dispatch(
      createEnvelope({ eventType: "tenant.settings.updated" })
    );

    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
