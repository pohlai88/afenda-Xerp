import {
  ACCOUNTING_READINESS_GATE_REQUIREMENT_COPY,
  type AccountingReadinessGateRequirementCopy,
} from "./accounting-readiness-gate.copy.contract";
import type {
  AccountingReadinessGateLiveSnapshot,
  AccountingReadinessRequirementLiveStatus,
} from "./accounting-readiness-gate-live-status.contract.js";
import { spawnAccountingReadinessGateLiveStatus } from "./spawn-accounting-readiness-gate-live-status.server";

export type AccountingReadinessGateLiveStatusKind = "pass" | "fail" | "skipped";

export interface AccountingReadinessGateLiveStatusOptions {
  readonly bypassCache?: boolean;
  readonly runDelegatedGates?: boolean;
}

export interface AccountingReadinessGateRequirementStatus {
  readonly checkedAt: string;
  readonly delegatedGates: readonly string[];
  readonly delegatedResults: readonly {
    readonly gate: string;
    readonly kind: AccountingReadinessGateLiveStatusKind;
    readonly message: string | null;
  }[];
  readonly evidencePassed: boolean;
  readonly id: AccountingReadinessGateRequirementCopy["id"];
  readonly liveKind: AccountingReadinessGateLiveStatusKind;
  readonly messages: readonly string[];
  readonly number: number;
  readonly requirement: string;
  readonly runMode: AccountingReadinessGateLiveSnapshot["runMode"];
  readonly testFiles: readonly string[];
}

let cachedSnapshot: AccountingReadinessGateLiveSnapshot | null = null;
let cachedAtMs = 0;

const LIVE_STATUS_CACHE_TTL_MS = 5 * 60 * 1000;

function resolveRunDelegatedGates(): boolean {
  if (process.env["VITEST"] === "true") {
    return false;
  }

  return process.env["AFENDA_ACCOUNTING_READINESS_DIAGNOSTICS_FULL"] === "1";
}

function loadLiveSnapshot(
  options?: AccountingReadinessGateLiveStatusOptions
): AccountingReadinessGateLiveSnapshot {
  const now = Date.now();
  const runDelegatedGates =
    options?.runDelegatedGates ?? resolveRunDelegatedGates();

  if (
    !options?.bypassCache &&
    cachedSnapshot &&
    cachedSnapshot.runMode ===
      (runDelegatedGates ? "full" : "structure-only") &&
    now - cachedAtMs < LIVE_STATUS_CACHE_TTL_MS
  ) {
    return cachedSnapshot;
  }

  const snapshot = spawnAccountingReadinessGateLiveStatus({
    runDelegatedGates,
  });
  cachedSnapshot = snapshot;
  cachedAtMs = now;
  return snapshot;
}

function mapDelegatedKind(
  kind: AccountingReadinessRequirementLiveStatus["delegatedResults"][number]["kind"]
): AccountingReadinessGateLiveStatusKind {
  return kind;
}

function mergeRequirementStatus(
  copy: AccountingReadinessGateRequirementCopy,
  live: AccountingReadinessRequirementLiveStatus | undefined,
  snapshot: AccountingReadinessGateLiveSnapshot
): AccountingReadinessGateRequirementStatus {
  if (!live) {
    return {
      id: copy.id,
      number: copy.number,
      requirement: copy.requirement,
      delegatedGates: copy.delegatedGates,
      testFiles: copy.testFiles,
      checkedAt: snapshot.checkedAt,
      runMode: snapshot.runMode,
      evidencePassed: false,
      liveKind: "fail",
      messages: ["Live status missing for requirement"],
      delegatedResults: copy.delegatedGates.map((gate) => ({
        gate,
        kind: "skipped" as const,
        message: null,
      })),
    };
  }

  return {
    id: copy.id,
    number: copy.number,
    requirement: copy.requirement,
    delegatedGates: copy.delegatedGates,
    testFiles: copy.testFiles,
    checkedAt: snapshot.checkedAt,
    runMode: snapshot.runMode,
    evidencePassed: live.evidencePassed,
    liveKind:
      live.kind === "fail"
        ? "fail"
        : live.delegatedResults.every((result) => result.kind === "skipped") &&
            copy.delegatedGates.length > 0
          ? "skipped"
          : live.kind,
    messages: live.messages,
    delegatedResults: live.delegatedResults.map((result) => ({
      gate: result.gate,
      kind: mapDelegatedKind(result.kind),
      message: result.message,
    })),
  };
}

/**
 * Live Phase 9 gate status for System Admin diagnostics.
 * Spawns the governance orchestrator — does not claim Architecture Authority sign-off.
 */
export function resolveAccountingReadinessGateLiveStatus(
  options?: AccountingReadinessGateLiveStatusOptions
): {
  readonly overallKind: AccountingReadinessGateLiveStatusKind;
  readonly requirements: readonly AccountingReadinessGateRequirementStatus[];
  readonly snapshot: AccountingReadinessGateLiveSnapshot;
} {
  const snapshot = loadLiveSnapshot(options);
  const liveById = new Map(
    snapshot.requirements.map((requirement) => [requirement.id, requirement])
  );

  const requirements = ACCOUNTING_READINESS_GATE_REQUIREMENT_COPY.map((copy) =>
    mergeRequirementStatus(copy, liveById.get(copy.id), snapshot)
  );

  return {
    snapshot,
    overallKind: snapshot.overallKind,
    requirements,
  };
}

export function resetAccountingReadinessGateLiveStatusCache(): void {
  cachedSnapshot = null;
  cachedAtMs = 0;
}

export function primeAccountingReadinessGateLiveStatusCache(
  snapshot: AccountingReadinessGateLiveSnapshot
): void {
  cachedSnapshot = snapshot;
  cachedAtMs = Date.now();
}
