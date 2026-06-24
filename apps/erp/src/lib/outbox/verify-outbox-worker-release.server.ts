import {
  evaluateWorkerReleaseAlignment,
  fetchLatestTriggerDeployment,
  isExecutionSuccess,
  readAppReleaseIdentifier,
  readWorkerReleaseCheckRequired,
} from "@afenda/execution";

import { createApiHandlerLogger } from "@/server/api/runtime/api-handler-logging";

import {
  assertWorkerReleaseStartupPolicy,
  type ExecutionSpinePolicy,
} from "@/lib/outbox/execution-spine-policy.server";
import {
  recordWorkerReleaseCheckFailure,
  recordWorkerReleaseCheckSkipped,
  recordWorkerReleaseCheckSuccess,
} from "@/lib/outbox/execution-spine-state.server";

const workerReleaseLogger = createApiHandlerLogger("outbox-worker-release");

export async function verifyOutboxWorkerRelease(input: {
  readonly policy: ExecutionSpinePolicy;
  readonly triggerSecretKeyConfigured: boolean;
}): Promise<void> {
  const workerReleaseCheckRequired = readWorkerReleaseCheckRequired();

  if (!(workerReleaseCheckRequired && input.triggerSecretKeyConfigured)) {
    recordWorkerReleaseCheckSkipped();
    return;
  }

  const appReleaseSha = readAppReleaseIdentifier();
  const deploymentResult = await fetchLatestTriggerDeployment();

  if (!isExecutionSuccess(deploymentResult)) {
    recordWorkerReleaseCheckFailure(deploymentResult.error.message);
    workerReleaseLogger.error("outbox.foundation.worker_release_failed", {
      critical:
        workerReleaseCheckRequired && !input.policy.allowDegradedExecution,
      reason: deploymentResult.error.message,
    });
    assertWorkerReleaseStartupPolicy({
      alignmentErrorMessage: deploymentResult.error.message,
      policy: input.policy,
      workerReleaseAligned: false,
      workerReleaseCheckRequired,
    });
    return;
  }

  const alignment = evaluateWorkerReleaseAlignment({
    appReleaseSha,
    triggerGitCommitSha: deploymentResult.value.gitCommitSha,
    workerReleaseCheckRequired,
  });

  if (alignment.aligned) {
    recordWorkerReleaseCheckSuccess({
      appReleaseSha,
      deployment: deploymentResult.value,
    });
    workerReleaseLogger.info("outbox.foundation.worker_release_aligned", {
      appReleaseSha,
      triggerDeploymentVersion: deploymentResult.value.deploymentVersion,
      triggerGitCommitSha: deploymentResult.value.gitCommitSha,
      triggerWorkerVersion: deploymentResult.value.workerVersion,
    });
    return;
  }

  recordWorkerReleaseCheckFailure(alignment.errorMessage);
  workerReleaseLogger.error("outbox.foundation.worker_release_failed", {
    critical:
      workerReleaseCheckRequired && !input.policy.allowDegradedExecution,
    reason: alignment.errorMessage,
  });

  assertWorkerReleaseStartupPolicy({
    alignmentErrorMessage: alignment.errorMessage,
    policy: input.policy,
    workerReleaseAligned: false,
    workerReleaseCheckRequired,
  });
}
