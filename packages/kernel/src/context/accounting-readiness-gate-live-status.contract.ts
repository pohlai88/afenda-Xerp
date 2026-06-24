import type { AccountingReadinessGateRequirementId } from "./accounting-readiness-gate-requirement-id.contract.js";

export type AccountingReadinessDelegatedGateRunKind =
  | "pass"
  | "fail"
  | "skipped";

export type AccountingReadinessRequirementLiveKind = "pass" | "fail";

export type AccountingReadinessGateLiveRunMode = "structure-only" | "full";

export interface AccountingReadinessDelegatedGateRunResult {
  readonly gate: string;
  readonly kind: AccountingReadinessDelegatedGateRunKind;
  readonly message: string | null;
}

export interface AccountingReadinessRequirementLiveStatus {
  readonly delegatedResults: readonly AccountingReadinessDelegatedGateRunResult[];
  readonly evidencePassed: boolean;
  readonly id: AccountingReadinessGateRequirementId;
  readonly kind: AccountingReadinessRequirementLiveKind;
  readonly messages: readonly string[];
  readonly number: number;
  readonly requirement: string;
}

export interface AccountingReadinessGateLiveSnapshot {
  readonly checkedAt: string;
  readonly overallKind: AccountingReadinessRequirementLiveKind;
  readonly requirements: readonly AccountingReadinessRequirementLiveStatus[];
  readonly runMode: AccountingReadinessGateLiveRunMode;
}

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _AccountingReadinessGateLiveSnapshotSerializable =
  AssertJsonSerializable<AccountingReadinessGateLiveSnapshot>;

export type assertAccountingReadinessGateLiveSnapshotJsonSerializable =
  _AccountingReadinessGateLiveSnapshotSerializable extends true ? true : never;
