import { describe, expect, it, vi } from "vitest";

import {
  readAppReleaseIdentifier,
  readWorkerReleaseCheckRequired,
} from "../lib/app-release-identifier.js";
import { evaluateWorkerReleaseAlignment } from "../lib/worker-release-alignment.js";
import { fetchLatestTriggerDeployment } from "../services/trigger-deployment.service.js";

const WORKER_RELEASE_MISMATCH = /mismatch/i;

describe("app release identifier", () => {
  it("prefers explicit AFENDA_RELEASE_SHA", () => {
    expect(
      readAppReleaseIdentifier({
        AFENDA_RELEASE_SHA: "abc123",
        VERCEL_GIT_COMMIT_SHA: "def456",
      })
    ).toBe("abc123");
  });

  it("defaults worker release check to scheduler policy", () => {
    expect(
      readWorkerReleaseCheckRequired({
        OUTBOX_SCHEDULER_REQUIRED: "true",
      })
    ).toBe(true);

    expect(
      readWorkerReleaseCheckRequired({
        OUTBOX_SCHEDULER_REQUIRED: "false",
        WORKER_RELEASE_CHECK_REQUIRED: "true",
      })
    ).toBe(true);
  });
});

describe("worker release alignment", () => {
  it("requires matching git SHAs when check is enabled", () => {
    expect(
      evaluateWorkerReleaseAlignment({
        appReleaseSha: "abc123",
        triggerGitCommitSha: "abc123",
        workerReleaseCheckRequired: true,
      })
    ).toEqual({
      aligned: true,
      errorMessage: null,
      skipped: false,
    });
  });

  it("fails when SHAs differ", () => {
    const result = evaluateWorkerReleaseAlignment({
      appReleaseSha: "abc123",
      triggerGitCommitSha: "def456",
      workerReleaseCheckRequired: true,
    });

    expect(result.aligned).toBe(false);
    expect(result.errorMessage).toMatch(WORKER_RELEASE_MISMATCH);
  });
});

describe("fetchLatestTriggerDeployment", () => {
  it("parses the latest deployed Trigger.dev worker", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            git: { commitSha: "abc123" },
            id: "dep_123",
            status: "DEPLOYED",
            version: "20250623.1",
            worker: { version: "20250623.1-worker" },
          },
        ],
      }),
    });

    const result = await fetchLatestTriggerDeployment({
      env: {
        TRIGGER_API_URL: "https://api.trigger.dev",
        TRIGGER_SECRET_KEY: "tr_dev_test",
      },
      fetchImpl,
      nowIso: () => "2026-06-23T00:00:00.000Z",
    });

    expect(result.status).toBe("success");
    if (result.status === "success") {
      expect(result.value.deploymentVersion).toBe("20250623.1");
      expect(result.value.gitCommitSha).toBe("abc123");
      expect(result.value.workerVersion).toBe("20250623.1-worker");
    }
  });
});
