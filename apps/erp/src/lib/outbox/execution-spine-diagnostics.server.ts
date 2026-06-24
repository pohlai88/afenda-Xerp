import { getDb, outboxEvents } from "@afenda/database";
import {
  evaluateWorkerReleaseAlignment,
  fetchLatestTriggerDeployment,
  isExecutionSuccess,
  PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
  probePublishOutboxScheduleRegistered,
  readAppReleaseIdentifier,
  readWorkerReleaseCheckRequired,
} from "@afenda/execution";
import { count, eq, max, min } from "drizzle-orm";

import {
  readExecutionSpinePolicy,
  readTriggerSecretKeyConfigured,
  resolveTriggerProviderState,
} from "@/lib/outbox/execution-spine-policy.server";
import { getExecutionSpineRegistrationState } from "@/lib/outbox/execution-spine-state.server";

export type ExecutionSpineOperationalStatus =
  | "healthy"
  | "degraded"
  | "critical";

export interface ExecutionSpineDiagnostics {
  readonly allowDegradedExecution: boolean;
  readonly appReleaseSha: string | null;
  readonly deadLetterCount: number | null;
  readonly lastScheduleRegistrationAt: string | null;
  readonly lastScheduleRegistrationError: string | null;
  readonly lastSuccessfulPublishAt: string | null;
  readonly lastWorkerVersionCheckAt: string | null;
  readonly lastWorkerVersionCheckError: string | null;
  readonly oldestPendingOutboxAgeSeconds: number | null;
  readonly operationalStatus: ExecutionSpineOperationalStatus;
  readonly outboxScheduleId: string | null;
  readonly outboxScheduleRegistered: boolean;
  readonly pendingOutboxCount: number | null;
  readonly schedulerRequired: boolean;
  readonly triggerDeploymentVersion: string | null;
  readonly triggerGitCommitSha: string | null;
  readonly triggerProviderState: ReturnType<typeof resolveTriggerProviderState>;
  readonly triggerWorkerVersion: string | null;
  readonly workerReleaseAligned: boolean;
  readonly workerReleaseCheckRequired: boolean;
}

interface OutboxMetricsSnapshot {
  readonly deadLetterCount: number;
  readonly lastSuccessfulPublishAt: string | null;
  readonly oldestPendingAvailableAt: string | null;
  readonly pendingOutboxCount: number;
}

interface LiveWorkerReleaseProbe {
  readonly appReleaseSha: string | null;
  readonly lastWorkerVersionCheckAt: string | null;
  readonly lastWorkerVersionCheckError: string | null;
  readonly triggerDeploymentVersion: string | null;
  readonly triggerGitCommitSha: string | null;
  readonly triggerWorkerVersion: string | null;
  readonly workerReleaseAligned: boolean;
}

interface LiveScheduleProbe {
  readonly lastScheduleRegistrationError: string | null;
  readonly outboxScheduleRegistered: boolean;
}

function toIsoString(value: Date | string | null): string | null {
  if (value === null) {
    return null;
  }

  return value instanceof Date ? value.toISOString() : value;
}

async function readOutboxMetricsSnapshot(): Promise<OutboxMetricsSnapshot | null> {
  try {
    const db = getDb();
    const [pendingRow] = await db
      .select({
        count: count(),
        oldestAvailableAt: min(outboxEvents.availableAt),
      })
      .from(outboxEvents)
      .where(eq(outboxEvents.status, "pending"));

    const [deadLetterRow] = await db
      .select({ count: count() })
      .from(outboxEvents)
      .where(eq(outboxEvents.status, "dead_letter"));

    const [publishedRow] = await db
      .select({ lastPublishedAt: max(outboxEvents.publishedAt) })
      .from(outboxEvents)
      .where(eq(outboxEvents.status, "published"));

    return {
      deadLetterCount: Number(deadLetterRow?.count ?? 0),
      lastSuccessfulPublishAt: toIsoString(
        publishedRow?.lastPublishedAt ?? null
      ),
      oldestPendingAvailableAt: toIsoString(
        pendingRow?.oldestAvailableAt ?? null
      ),
      pendingOutboxCount: Number(pendingRow?.count ?? 0),
    };
  } catch {
    return null;
  }
}

function resolveOldestPendingAgeSeconds(
  oldestPendingAvailableAt: string | null
): number | null {
  if (!oldestPendingAvailableAt) {
    return null;
  }

  const oldestMs = Date.parse(oldestPendingAvailableAt);

  if (Number.isNaN(oldestMs)) {
    return null;
  }

  return Math.max(0, Math.floor((Date.now() - oldestMs) / 1000));
}

export function resolveExecutionSpineOperationalStatus(input: {
  readonly allowDegradedExecution: boolean;
  readonly outboxScheduleRegistered: boolean;
  readonly schedulerRequired: boolean;
  readonly triggerProviderState: ReturnType<typeof resolveTriggerProviderState>;
  readonly workerReleaseAligned: boolean;
  readonly workerReleaseCheckRequired: boolean;
}): ExecutionSpineOperationalStatus {
  if (!input.schedulerRequired) {
    return input.outboxScheduleRegistered ? "healthy" : "degraded";
  }

  if (
    input.triggerProviderState !== "active" ||
    !input.outboxScheduleRegistered
  ) {
    return input.allowDegradedExecution ? "degraded" : "critical";
  }

  if (input.workerReleaseCheckRequired && !input.workerReleaseAligned) {
    return input.allowDegradedExecution ? "degraded" : "critical";
  }

  return "healthy";
}

async function resolveLiveWorkerReleaseProbe(input: {
  readonly workerReleaseCheckRequired: boolean;
}): Promise<LiveWorkerReleaseProbe> {
  const registration = getExecutionSpineRegistrationState();
  const appReleaseSha = readAppReleaseIdentifier();
  const checkedAt = new Date().toISOString();

  if (!input.workerReleaseCheckRequired) {
    return {
      appReleaseSha,
      lastWorkerVersionCheckAt: registration.lastWorkerVersionCheckAt,
      lastWorkerVersionCheckError: null,
      triggerDeploymentVersion: registration.triggerDeploymentVersion,
      triggerGitCommitSha: registration.triggerGitCommitSha,
      triggerWorkerVersion: registration.triggerWorkerVersion,
      workerReleaseAligned: true,
    };
  }

  if (!readTriggerSecretKeyConfigured()) {
    return {
      appReleaseSha,
      lastWorkerVersionCheckAt: checkedAt,
      lastWorkerVersionCheckError: "TRIGGER_SECRET_KEY is not configured.",
      triggerDeploymentVersion: null,
      triggerGitCommitSha: null,
      triggerWorkerVersion: null,
      workerReleaseAligned: false,
    };
  }

  const deploymentResult = await fetchLatestTriggerDeployment();

  if (!isExecutionSuccess(deploymentResult)) {
    return {
      appReleaseSha,
      lastWorkerVersionCheckAt: checkedAt,
      lastWorkerVersionCheckError: deploymentResult.error.message,
      triggerDeploymentVersion: null,
      triggerGitCommitSha: null,
      triggerWorkerVersion: null,
      workerReleaseAligned: false,
    };
  }

  const alignment = evaluateWorkerReleaseAlignment({
    appReleaseSha,
    triggerGitCommitSha: deploymentResult.value.gitCommitSha,
    workerReleaseCheckRequired: input.workerReleaseCheckRequired,
  });

  return {
    appReleaseSha,
    lastWorkerVersionCheckAt: deploymentResult.value.checkedAt,
    lastWorkerVersionCheckError: alignment.errorMessage,
    triggerDeploymentVersion: deploymentResult.value.deploymentVersion,
    triggerGitCommitSha: deploymentResult.value.gitCommitSha,
    triggerWorkerVersion: deploymentResult.value.workerVersion,
    workerReleaseAligned: alignment.aligned,
  };
}

async function resolveLiveScheduleProbe(input: {
  readonly schedulerRequired: boolean;
}): Promise<LiveScheduleProbe> {
  const registration = getExecutionSpineRegistrationState();

  if (registration.outboxScheduleRegistered) {
    return {
      lastScheduleRegistrationError: registration.lastScheduleRegistrationError,
      outboxScheduleRegistered: true,
    };
  }

  if (!input.schedulerRequired) {
    return {
      lastScheduleRegistrationError: null,
      outboxScheduleRegistered: false,
    };
  }

  if (!readTriggerSecretKeyConfigured()) {
    return {
      lastScheduleRegistrationError: "TRIGGER_SECRET_KEY is not configured.",
      outboxScheduleRegistered: false,
    };
  }

  const probeResult = await probePublishOutboxScheduleRegistered();

  if (!isExecutionSuccess(probeResult)) {
    return {
      lastScheduleRegistrationError: probeResult.error.message,
      outboxScheduleRegistered: false,
    };
  }

  return {
    lastScheduleRegistrationError: probeResult.value
      ? null
      : "Outbox schedule is not registered in Trigger.dev.",
    outboxScheduleRegistered: probeResult.value,
  };
}

export async function collectExecutionSpineDiagnostics(): Promise<ExecutionSpineDiagnostics> {
  const policy = readExecutionSpinePolicy();
  const registration = getExecutionSpineRegistrationState();
  const triggerProviderState = resolveTriggerProviderState();
  const workerReleaseCheckRequired = readWorkerReleaseCheckRequired();
  const metrics = await readOutboxMetricsSnapshot();
  const [workerRelease, schedule] = await Promise.all([
    resolveLiveWorkerReleaseProbe({ workerReleaseCheckRequired }),
    resolveLiveScheduleProbe({ schedulerRequired: policy.schedulerRequired }),
  ]);

  const operationalStatus = resolveExecutionSpineOperationalStatus({
    allowDegradedExecution: policy.allowDegradedExecution,
    outboxScheduleRegistered: schedule.outboxScheduleRegistered,
    schedulerRequired: policy.schedulerRequired,
    triggerProviderState,
    workerReleaseAligned: workerRelease.workerReleaseAligned,
    workerReleaseCheckRequired,
  });

  return {
    allowDegradedExecution: policy.allowDegradedExecution,
    appReleaseSha: workerRelease.appReleaseSha,
    deadLetterCount: metrics?.deadLetterCount ?? null,
    lastScheduleRegistrationAt:
      registration.lastScheduleRegistrationAt ??
      (schedule.outboxScheduleRegistered
        ? workerRelease.lastWorkerVersionCheckAt
        : null),
    lastScheduleRegistrationError: schedule.lastScheduleRegistrationError,
    lastSuccessfulPublishAt: metrics?.lastSuccessfulPublishAt ?? null,
    lastWorkerVersionCheckAt: workerRelease.lastWorkerVersionCheckAt,
    lastWorkerVersionCheckError: workerRelease.lastWorkerVersionCheckError,
    oldestPendingOutboxAgeSeconds: resolveOldestPendingAgeSeconds(
      metrics?.oldestPendingAvailableAt ?? null
    ),
    operationalStatus,
    outboxScheduleId:
      registration.outboxScheduleId ?? PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
    outboxScheduleRegistered: schedule.outboxScheduleRegistered,
    pendingOutboxCount: metrics?.pendingOutboxCount ?? null,
    schedulerRequired: policy.schedulerRequired,
    triggerDeploymentVersion: workerRelease.triggerDeploymentVersion,
    triggerGitCommitSha: workerRelease.triggerGitCommitSha,
    triggerProviderState,
    triggerWorkerVersion: workerRelease.triggerWorkerVersion,
    workerReleaseAligned: workerRelease.workerReleaseAligned,
    workerReleaseCheckRequired,
  };
}
