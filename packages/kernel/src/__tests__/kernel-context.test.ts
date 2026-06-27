import { describe, expect, it } from "vitest";
import { createExecutionContext } from "../contracts/execution-context.contract.js";
import {
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
} from "../identity/index.js";
import { kernelContext } from "../propagation/kernel-context.js";
import type { KernelContextFrame } from "../propagation/kernel-context-frame.contract.js";

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

  it("throws when fork() runs without an active frame", () => {
    expect(() => kernelContext.fork(buildFrame(), () => null)).toThrow(
      /active frame/
    );
  });
});
