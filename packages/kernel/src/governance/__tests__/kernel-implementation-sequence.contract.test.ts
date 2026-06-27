import { describe, expect, it } from "vitest";

import {
  getKernelImplementationSequenceStep,
  isKernelImplementationSequenceStepId,
  KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_ADDITIONS,
  KERNEL_IMPLEMENTATION_SEQUENCE_POLICY,
  KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS,
  KERNEL_IMPLEMENTATION_SEQUENCE_STEPS,
  type KernelImplementationSequenceStep,
  listKernelImplementationSequenceSteps,
} from "../kernel-implementation-sequence.contract.js";

const PAS_SECTION_11_DEFERRED = [
  "FiscalCalendarContext",
  "CurrencyContext",
  "fiscal period state outside already-approved accounting-domain vocabulary",
  "fiscal year start month",
  "period open/close/lock runtime status",
  "functional/base/reporting currency decisions",
  "currency conversion",
  "locale resolver",
  "formatting implementation",
] as const;

describe("kernel implementation sequence (PAS-001 §11)", () => {
  it("registers eleven ordered steps with unique ids", () => {
    expect(KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS).toHaveLength(11);
    expect(KERNEL_IMPLEMENTATION_SEQUENCE_STEPS).toHaveLength(11);
    expect(new Set(KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS).size).toBe(11);

    const orders = KERNEL_IMPLEMENTATION_SEQUENCE_STEPS.map(
      (step) => step.order
    );
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("maps step ids through lookup helpers", () => {
    for (const id of KERNEL_IMPLEMENTATION_SEQUENCE_STEP_IDS) {
      expect(isKernelImplementationSequenceStepId(id)).toBe(true);
      expect(getKernelImplementationSequenceStep(id).id).toBe(id);
    }

    expect(isKernelImplementationSequenceStepId("unknown-step")).toBe(false);
    expect(listKernelImplementationSequenceSteps()).toHaveLength(11);
  });

  it("freezes deferred additions matching PAS §11 prose", () => {
    expect(KERNEL_IMPLEMENTATION_SEQUENCE_DEFERRED_ADDITIONS).toEqual(
      PAS_SECTION_11_DEFERRED
    );
    expect(KERNEL_IMPLEMENTATION_SEQUENCE_POLICY.deferredAdditions).toEqual(
      PAS_SECTION_11_DEFERRED
    );
  });

  it("requires evidence paths and gate script arrays on every step", () => {
    for (const step of KERNEL_IMPLEMENTATION_SEQUENCE_STEPS) {
      expect(step.label.length).toBeGreaterThan(0);
      expect(step.evidencePaths.length).toBeGreaterThan(0);
      expect(Array.isArray(step.gateScripts)).toBe(true);
    }
  });

  it("wires governance script gates on propagation, events, and zero-deps steps", () => {
    expect(
      getKernelImplementationSequenceStep("async-context-propagation")
        .gateScripts
    ).toContain("check:kernel-propagation-isolation");
    expect(
      getKernelImplementationSequenceStep("domain-event-envelope").gateScripts
    ).toContain("check:kernel-events-wire-serializable");
    expect(
      getKernelImplementationSequenceStep("governance-scripts").gateScripts
    ).toEqual([
      "check:kernel-propagation-isolation",
      "check:kernel-events-wire-serializable",
      "check:kernel-zero-runtime-deps",
    ]);
  });
});

type AssertSerializable<T> = T extends string | number | boolean | null
  ? true
  : T extends readonly (infer U)[]
    ? AssertSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _StepSerializable =
  AssertSerializable<KernelImplementationSequenceStep> extends true
    ? true
    : never;
