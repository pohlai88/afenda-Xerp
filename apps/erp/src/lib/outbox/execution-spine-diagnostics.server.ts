import type { ExecutionSpineDiagnosticsDto } from "@/server/api/contracts/health.api-contract";

export type ExecutionSpineOperationalStatus =
  ExecutionSpineDiagnosticsDto["operationalStatus"];

/** ADR-0027 skeleton — execution spine package removed; health probe returns static diagnostics. */
export async function collectExecutionSpineDiagnostics(): Promise<ExecutionSpineDiagnosticsDto> {
  return {
    allowDegradedExecution: false,
    appReleaseSha: null,
    deadLetterCount: 0,
    lastScheduleRegistrationAt: null,
    lastScheduleRegistrationError: null,
    lastSuccessfulPublishAt: null,
    lastWorkerVersionCheckAt: null,
    lastWorkerVersionCheckError: null,
    oldestPendingOutboxAgeSeconds: 0,
    operationalStatus: "healthy",
    outboxScheduleId: null,
    outboxScheduleRegistered: false,
    pendingOutboxCount: 0,
    schedulerRequired: false,
    triggerDeploymentVersion: null,
    triggerGitCommitSha: null,
    triggerProviderState: "unavailable",
    triggerWorkerVersion: null,
    workerReleaseAligned: true,
    workerReleaseCheckRequired: false,
  };
}
