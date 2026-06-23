import type { TriggerDeploymentSnapshot } from "@afenda/execution";
import { PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID } from "@afenda/execution";

export interface ExecutionSpineRegistrationState {
  readonly appReleaseSha: string | null;
  readonly foundationRegistered: boolean;
  readonly lastScheduleRegistrationAt: string | null;
  readonly lastScheduleRegistrationError: string | null;
  readonly lastWorkerVersionCheckAt: string | null;
  readonly lastWorkerVersionCheckError: string | null;
  readonly outboxScheduleId: string | null;
  readonly outboxScheduleRegistered: boolean;
  readonly triggerDeploymentVersion: string | null;
  readonly triggerGitCommitSha: string | null;
  readonly triggerWorkerVersion: string | null;
  readonly workerReleaseAligned: boolean;
  readonly workerReleaseCheckRequired: boolean;
}

const initialState = (): ExecutionSpineRegistrationState => ({
  appReleaseSha: null,
  foundationRegistered: false,
  lastScheduleRegistrationAt: null,
  lastScheduleRegistrationError: null,
  lastWorkerVersionCheckAt: null,
  lastWorkerVersionCheckError: null,
  outboxScheduleId: null,
  outboxScheduleRegistered: false,
  triggerDeploymentVersion: null,
  triggerGitCommitSha: null,
  triggerWorkerVersion: null,
  workerReleaseAligned: false,
  workerReleaseCheckRequired: false,
});

let registrationState: ExecutionSpineRegistrationState = initialState();

export function getExecutionSpineRegistrationState(): ExecutionSpineRegistrationState {
  return registrationState;
}

export function recordScheduleRegistrationSuccess(scheduleId: string): void {
  registrationState = {
    ...registrationState,
    lastScheduleRegistrationAt: new Date().toISOString(),
    lastScheduleRegistrationError: null,
    outboxScheduleId: scheduleId,
    outboxScheduleRegistered: true,
  };
}

export function recordScheduleRegistrationSkipped(): void {
  registrationState = {
    ...registrationState,
    lastScheduleRegistrationAt: null,
    lastScheduleRegistrationError: null,
    outboxScheduleId: PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
    outboxScheduleRegistered: false,
  };
}

export function recordScheduleRegistrationFailure(message: string): void {
  registrationState = {
    ...registrationState,
    lastScheduleRegistrationAt: new Date().toISOString(),
    lastScheduleRegistrationError: message,
    outboxScheduleRegistered: false,
  };
}

export function recordWorkerReleaseCheckSkipped(): void {
  registrationState = {
    ...registrationState,
    lastWorkerVersionCheckAt: new Date().toISOString(),
    lastWorkerVersionCheckError: null,
    workerReleaseAligned: false,
    workerReleaseCheckRequired: false,
  };
}

export function recordWorkerReleaseCheckSuccess(input: {
  readonly appReleaseSha: string | null;
  readonly deployment: TriggerDeploymentSnapshot;
}): void {
  registrationState = {
    ...registrationState,
    appReleaseSha: input.appReleaseSha,
    lastWorkerVersionCheckAt: input.deployment.checkedAt,
    lastWorkerVersionCheckError: null,
    triggerDeploymentVersion: input.deployment.deploymentVersion,
    triggerGitCommitSha: input.deployment.gitCommitSha,
    triggerWorkerVersion: input.deployment.workerVersion,
    workerReleaseAligned: true,
    workerReleaseCheckRequired: true,
  };
}

export function recordWorkerReleaseCheckFailure(message: string | null): void {
  registrationState = {
    ...registrationState,
    lastWorkerVersionCheckAt: new Date().toISOString(),
    lastWorkerVersionCheckError: message,
    workerReleaseAligned: false,
    workerReleaseCheckRequired: true,
  };
}

export function markOutboxFoundationRegistered(): void {
  registrationState = {
    ...registrationState,
    foundationRegistered: true,
  };
}

export function resetExecutionSpineRegistrationStateForTests(): void {
  registrationState = initialState();
}
