import { getDb, outboxEvents } from "@afenda/database";
import {
  PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
  readWorkerReleaseCheckRequired,
} from "@afenda/execution";
import { count, eq, max, min } from "drizzle-orm";

import {
  readExecutionSpinePolicy,
  resolveTriggerProviderState,
} from "./execution-spine-policy.server.js";
import { getExecutionSpineRegistrationState } from "./execution-spine-state.server.js";

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

export async function collectExecutionSpineDiagnostics(): Promise<ExecutionSpineDiagnostics> {
  const policy = readExecutionSpinePolicy();
  const registration = getExecutionSpineRegistrationState();
  const triggerProviderState = resolveTriggerProviderState();
  const workerReleaseCheckRequired = readWorkerReleaseCheckRequired();
  const metrics = await readOutboxMetricsSnapshot();

  const operationalStatus = resolveExecutionSpineOperationalStatus({
    allowDegradedExecution: policy.allowDegradedExecution,
    outboxScheduleRegistered: registration.outboxScheduleRegistered,
    schedulerRequired: policy.schedulerRequired,
    triggerProviderState,
    workerReleaseAligned: registration.workerReleaseAligned,
    workerReleaseCheckRequired,
  });

  return {
    allowDegradedExecution: policy.allowDegradedExecution,
    appReleaseSha: registration.appReleaseSha,
    deadLetterCount: metrics?.deadLetterCount ?? null,
    lastScheduleRegistrationAt: registration.lastScheduleRegistrationAt,
    lastScheduleRegistrationError: registration.lastScheduleRegistrationError,
    lastSuccessfulPublishAt: metrics?.lastSuccessfulPublishAt ?? null,
    lastWorkerVersionCheckAt: registration.lastWorkerVersionCheckAt,
    lastWorkerVersionCheckError: registration.lastWorkerVersionCheckError,
    oldestPendingOutboxAgeSeconds: resolveOldestPendingAgeSeconds(
      metrics?.oldestPendingAvailableAt ?? null
    ),
    operationalStatus,
    outboxScheduleId:
      registration.outboxScheduleId ?? PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
    outboxScheduleRegistered: registration.outboxScheduleRegistered,
    pendingOutboxCount: metrics?.pendingOutboxCount ?? null,
    schedulerRequired: policy.schedulerRequired,
    triggerDeploymentVersion: registration.triggerDeploymentVersion,
    triggerGitCommitSha: registration.triggerGitCommitSha,
    triggerProviderState,
    triggerWorkerVersion: registration.triggerWorkerVersion,
    workerReleaseAligned: workerReleaseCheckRequired
      ? registration.workerReleaseAligned
      : true,
    workerReleaseCheckRequired,
  };
}
