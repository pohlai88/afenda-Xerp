import { describe, expect, it } from "vitest";
import { createExecutionContext } from "../../contracts/execution-context.contract.js";
import {
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
} from "../../identity/index.js";
import { kernelContext } from "../kernel-context.js";
import {
  assertKernelContextFrame,
  assertWireKernelContextFrame,
} from "../kernel-context-frame.assert.js";
import type { KernelContextFrame } from "../kernel-context-frame.contract.js";
import {
  normalizeKernelContextFrameForWire,
  serializeKernelContextFrame,
} from "../kernel-context-frame.parser.js";

const FIXTURE_GENERATOR = createFixtureCanonicalIdBodyGenerator();
const CORRELATION_FIXTURE_BODIES = [
  "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV",
  "01ARZ3NDEKTSV4RRFFQ69G5FCV",
] as const;

let frameSequence = 0;

function buildFrame(): KernelContextFrame {
  const correlationId = createTestEnterpriseId(
    "correlation",
    CORRELATION_FIXTURE_BODIES[
      frameSequence % CORRELATION_FIXTURE_BODIES.length
    ]!
  );
  frameSequence += 1;
  return {
    correlationId,
    executionContext: createExecutionContext({
      correlationId,
      canonicalIdBodyGenerator: FIXTURE_GENERATOR,
      source: "api",
    }),
    tenantId: null,
  };
}

describe("kernel context propagation", () => {
  it("returns null outside run()", () => {
    expect(kernelContext.get()).toBeNull();
  });

  it("exposes the active frame inside run()", () => {
    const frame = buildFrame();
    kernelContext.run(frame, () => {
      expect(kernelContext.get()).toEqual(frame);
    });
    expect(kernelContext.get()).toBeNull();
  });

  it("clones the frame on run() so caller mutation does not leak into ALS", () => {
    const frame = buildFrame();
    const originalSource = frame.executionContext.source;

    kernelContext.run(frame, () => {
      expect(kernelContext.get()?.executionContext.source).toBe(originalSource);
      (frame.executionContext as { source: typeof originalSource }).source =
        "cron";
      expect(kernelContext.get()?.executionContext.source).toBe(originalSource);
    });

    expect(frame.executionContext.source).toBe("cron");
  });

  it("isolates concurrent fork() frames", async () => {
    const parent = buildFrame();

    await kernelContext.run(parent, async () => {
      const frameA = buildFrame();
      const frameB = buildFrame();
      const results = await Promise.all([
        Promise.resolve(kernelContext.fork(frameA, () => kernelContext.get())),
        Promise.resolve(kernelContext.fork(frameB, () => kernelContext.get())),
      ]);

      expect(results[0]?.correlationId).toBe(frameA.correlationId);
      expect(results[1]?.correlationId).toBe(frameB.correlationId);
      expect(frameA.correlationId).not.toBe(frameB.correlationId);
      expect(kernelContext.get()).toEqual(parent);
    });
  });

  it("fork() ignores explicit undefined overrides at the frame level", () => {
    const parent = buildFrame();

    kernelContext.run(parent, () => {
      const overrides = {
        correlationId: undefined,
        tenantId: undefined,
      } as unknown as Parameters<typeof kernelContext.fork>[0];

      kernelContext.fork(overrides, () => {
        const active = kernelContext.get();
        expect(active?.correlationId).toBe(parent.correlationId);
        expect(active?.tenantId).toBe(parent.tenantId);
      });
    });
  });

  it("fork() deep-merges executionContext partials without undefined poisoning", () => {
    const parent = buildFrame();
    const originalActorId = parent.executionContext.actorId;

    kernelContext.run(parent, () => {
      kernelContext.fork(
        {
          executionContext: {
            actorId: undefined,
            source: "job",
          } as unknown as Partial<KernelContextFrame["executionContext"]>,
        },
        () => {
          const active = kernelContext.get();
          expect(active?.executionContext.source).toBe("job");
          expect(active?.executionContext.actorId).toBe(originalActorId);
          expect(active?.executionContext.correlationId).toBe(
            parent.executionContext.correlationId
          );
        }
      );
    });
  });

  it("throws when fork() runs without an active frame", () => {
    expect(() => kernelContext.fork(buildFrame(), () => null)).toThrow(
      /active frame/
    );
  });
});

describe("kernel context frame wire", () => {
  it("assertKernelContextFrame validates branded frames", () => {
    const frame = buildFrame();
    expect(assertKernelContextFrame(frame)).toEqual(frame);
  });

  it("serializeKernelContextFrame produces JSON-serializable wire output", () => {
    const frame = buildFrame();
    const wire = serializeKernelContextFrame(frame);

    expect(typeof wire.correlationId).toBe("string");
    expect(typeof wire.executionContext.executionId).toBe("string");
    expect(wire.tenantId).toBeNull();

    const roundTrip = JSON.parse(JSON.stringify(wire));
    assertWireKernelContextFrame(roundTrip);
    expect(normalizeKernelContextFrameForWire(frame)).toEqual(wire);
  });
});
