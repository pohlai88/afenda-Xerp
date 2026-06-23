import { parseEnvBoolean } from "@afenda/execution";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveExecutionSpineOperationalStatus } from "../lib/outbox/execution-spine-diagnostics.server.js";
import {
  assertSchedulerStartupPolicy,
  assertWorkerReleaseStartupPolicy,
  ExecutionSpinePolicyViolationError,
  readExecutionSpinePolicy,
  readTriggerSecretKeyConfigured,
  resolveTriggerProviderState,
} from "../lib/outbox/execution-spine-policy.server.js";
import { resetExecutionSpineRegistrationStateForTests } from "../lib/outbox/execution-spine-state.server.js";

afterEach(() => {
  resetExecutionSpineRegistrationStateForTests();
  vi.unstubAllEnvs();
});

const SCHEDULE_REGISTRATION_FAILED = /schedule registration failed/i;
const WORKER_RELEASE_ALIGNMENT_FAILED = /worker release alignment failed/i;

describe("execution spine policy", () => {
  it("defaults to degraded-friendly local policy", () => {
    vi.stubEnv("OUTBOX_SCHEDULER_REQUIRED", "");
    vi.stubEnv("ALLOW_DEGRADED_EXECUTION", "");

    expect(readExecutionSpinePolicy()).toEqual({
      allowDegradedExecution: false,
      schedulerRequired: false,
    });
  });

  it("parses boolean env values", () => {
    expect(parseEnvBoolean("true", false)).toBe(true);
    expect(parseEnvBoolean("0", true)).toBe(false);
    expect(parseEnvBoolean(undefined, true)).toBe(true);
  });

  it("detects configured Trigger secret key", () => {
    vi.stubEnv("TRIGGER_SECRET_KEY", "tr_dev_example");
    expect(readTriggerSecretKeyConfigured()).toBe(true);
    expect(resolveTriggerProviderState()).toBe("active");
  });

  it("fails startup when scheduler is required without Trigger credentials", () => {
    expect(() =>
      assertSchedulerStartupPolicy({
        policy: {
          allowDegradedExecution: false,
          schedulerRequired: true,
        },
        scheduleErrorMessage: null,
        scheduleRegistered: false,
        triggerSecretKeyConfigured: false,
      })
    ).toThrow(ExecutionSpinePolicyViolationError);
  });

  it("fails startup when scheduler is required but registration failed", () => {
    expect(() =>
      assertSchedulerStartupPolicy({
        policy: {
          allowDegradedExecution: false,
          schedulerRequired: true,
        },
        scheduleErrorMessage: "provider_error",
        scheduleRegistered: false,
        triggerSecretKeyConfigured: true,
      })
    ).toThrow(SCHEDULE_REGISTRATION_FAILED);
  });

  it("allows emergency degraded override when explicitly enabled", () => {
    expect(() =>
      assertSchedulerStartupPolicy({
        policy: {
          allowDegradedExecution: true,
          schedulerRequired: true,
        },
        scheduleErrorMessage: "provider_error",
        scheduleRegistered: false,
        triggerSecretKeyConfigured: false,
      })
    ).not.toThrow();
  });

  it("does not enforce scheduler policy when scheduler is optional", () => {
    expect(() =>
      assertSchedulerStartupPolicy({
        policy: {
          allowDegradedExecution: false,
          schedulerRequired: false,
        },
        scheduleErrorMessage: "ignored",
        scheduleRegistered: false,
        triggerSecretKeyConfigured: false,
      })
    ).not.toThrow();
  });

  it("fails startup when worker release alignment is required but mismatched", () => {
    expect(() =>
      assertWorkerReleaseStartupPolicy({
        alignmentErrorMessage: "Trigger worker release mismatch",
        policy: {
          allowDegradedExecution: false,
          schedulerRequired: true,
        },
        workerReleaseAligned: false,
        workerReleaseCheckRequired: true,
      })
    ).toThrow(WORKER_RELEASE_ALIGNMENT_FAILED);
  });
});

describe("execution spine operational status", () => {
  it("marks production-required scheduler failures as critical", () => {
    expect(
      resolveExecutionSpineOperationalStatus({
        allowDegradedExecution: false,
        outboxScheduleRegistered: false,
        schedulerRequired: true,
        triggerProviderState: "active",
        workerReleaseAligned: false,
        workerReleaseCheckRequired: false,
      })
    ).toBe("critical");
  });

  it("marks local optional scheduler mode as degraded", () => {
    expect(
      resolveExecutionSpineOperationalStatus({
        allowDegradedExecution: false,
        outboxScheduleRegistered: false,
        schedulerRequired: false,
        triggerProviderState: "degraded",
        workerReleaseAligned: false,
        workerReleaseCheckRequired: false,
      })
    ).toBe("degraded");
  });

  it("marks active scheduler registration as healthy", () => {
    expect(
      resolveExecutionSpineOperationalStatus({
        allowDegradedExecution: false,
        outboxScheduleRegistered: true,
        schedulerRequired: true,
        triggerProviderState: "active",
        workerReleaseAligned: true,
        workerReleaseCheckRequired: true,
      })
    ).toBe("healthy");
  });

  it("marks worker release mismatch as critical in production mode", () => {
    expect(
      resolveExecutionSpineOperationalStatus({
        allowDegradedExecution: false,
        outboxScheduleRegistered: true,
        schedulerRequired: true,
        triggerProviderState: "active",
        workerReleaseAligned: false,
        workerReleaseCheckRequired: true,
      })
    ).toBe("critical");
  });
});
