import { afterEach, describe, expect, it, vi } from "vitest";

const executionMocks = vi.hoisted(() => ({
  evaluateWorkerReleaseAlignment: vi.fn(),
  fetchLatestTriggerDeployment: vi.fn(),
  probePublishOutboxScheduleRegistered: vi.fn(),
  readAppReleaseIdentifier: vi.fn(),
  readWorkerReleaseCheckRequired: vi.fn(),
}));

vi.mock("@afenda/database", () => ({
  getDb: vi.fn(() => {
    throw new Error("database unavailable in diagnostics test");
  }),
  outboxEvents: {},
}));

vi.mock("@afenda/execution", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/execution")>();

  return {
    ...actual,
    evaluateWorkerReleaseAlignment:
      executionMocks.evaluateWorkerReleaseAlignment,
    fetchLatestTriggerDeployment: executionMocks.fetchLatestTriggerDeployment,
    probePublishOutboxScheduleRegistered:
      executionMocks.probePublishOutboxScheduleRegistered,
    readAppReleaseIdentifier: executionMocks.readAppReleaseIdentifier,
    readWorkerReleaseCheckRequired:
      executionMocks.readWorkerReleaseCheckRequired,
  };
});

import { collectExecutionSpineDiagnostics } from "../lib/outbox/execution-spine-diagnostics.server.js";
import {
  recordScheduleRegistrationSuccess,
  resetExecutionSpineRegistrationStateForTests,
} from "../lib/outbox/execution-spine-state.server.js";

afterEach(() => {
  resetExecutionSpineRegistrationStateForTests();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("collectExecutionSpineDiagnostics live probes", () => {
  it("uses in-memory registration when schedule is already registered", async () => {
    recordScheduleRegistrationSuccess("publish-outbox-events");

    executionMocks.readWorkerReleaseCheckRequired.mockReturnValue(false);
    executionMocks.readAppReleaseIdentifier.mockReturnValue("abc123");

    vi.stubEnv("OUTBOX_SCHEDULER_REQUIRED", "true");
    vi.stubEnv("TRIGGER_SECRET_KEY", "tr_prod_test");

    const diagnostics = await collectExecutionSpineDiagnostics();

    expect(diagnostics.outboxScheduleRegistered).toBe(true);
    expect(
      executionMocks.probePublishOutboxScheduleRegistered
    ).not.toHaveBeenCalled();
    expect(diagnostics.operationalStatus).toBe("healthy");
  });

  it("probes Trigger.dev when scheduler is required and registration is cold", async () => {
    executionMocks.readWorkerReleaseCheckRequired.mockReturnValue(true);
    executionMocks.readAppReleaseIdentifier.mockReturnValue("abc123");
    executionMocks.probePublishOutboxScheduleRegistered.mockResolvedValue({
      status: "success",
      value: true,
    });
    executionMocks.fetchLatestTriggerDeployment.mockResolvedValue({
      status: "success",
      value: {
        checkedAt: "2026-06-24T00:00:00.000Z",
        deploymentVersion: "20260624.1",
        gitCommitSha: "abc123",
        workerVersion: "20260624.1-worker",
      },
    });
    executionMocks.evaluateWorkerReleaseAlignment.mockReturnValue({
      aligned: true,
      errorMessage: null,
      skipped: false,
    });

    vi.stubEnv("OUTBOX_SCHEDULER_REQUIRED", "true");
    vi.stubEnv("TRIGGER_SECRET_KEY", "tr_prod_test");
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "abc123");

    const diagnostics = await collectExecutionSpineDiagnostics();

    expect(
      executionMocks.probePublishOutboxScheduleRegistered
    ).toHaveBeenCalledOnce();
    expect(executionMocks.fetchLatestTriggerDeployment).toHaveBeenCalledOnce();
    expect(diagnostics.outboxScheduleRegistered).toBe(true);
    expect(diagnostics.workerReleaseAligned).toBe(true);
    expect(diagnostics.appReleaseSha).toBe("abc123");
    expect(diagnostics.triggerDeploymentVersion).toBe("20260624.1");
    expect(diagnostics.operationalStatus).toBe("healthy");
  });

  it("reports critical when live schedule probe fails in production mode", async () => {
    executionMocks.readWorkerReleaseCheckRequired.mockReturnValue(false);
    executionMocks.readAppReleaseIdentifier.mockReturnValue(null);
    executionMocks.probePublishOutboxScheduleRegistered.mockResolvedValue({
      status: "failure",
      error: { message: "Trigger.dev schedule probe failed." },
    });

    vi.stubEnv("OUTBOX_SCHEDULER_REQUIRED", "true");
    vi.stubEnv("TRIGGER_SECRET_KEY", "tr_prod_test");

    const diagnostics = await collectExecutionSpineDiagnostics();

    expect(diagnostics.outboxScheduleRegistered).toBe(false);
    expect(diagnostics.lastScheduleRegistrationError).toBe(
      "Trigger.dev schedule probe failed."
    );
    expect(diagnostics.operationalStatus).toBe("critical");
  });
});
