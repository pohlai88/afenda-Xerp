import type {
  PolicyDecision,
  PolicyWireDecision,
} from "./policy-decision.contract.js";
import {
  isPolicyDecision,
  isPolicyDecisionKind,
} from "./policy-decision.contract.js";
import { isPolicyDenialReason } from "./policy-denial-reason.contract.js";

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

type _PolicyWireSerializable = AssertJsonSerializable<PolicyWireDecision>;

/** Compile-time guard — policy wire decision must remain JSON-serializable. */
export type assertPolicyDecisionWireSerializable =
  _PolicyWireSerializable extends true ? true : never;

function assertExactKeys(
  record: Record<string, unknown>,
  allowed: readonly string[]
): void {
  const keys = Object.keys(record);

  if (
    keys.length !== allowed.length ||
    !allowed.every((key) => keys.includes(key))
  ) {
    throw new Error(
      `PolicyWireDecision has unexpected keys; allowed: ${allowed.join(", ")}.`
    );
  }
}

function assertWirePolicyDenialReason(value: unknown, label: string): string {
  if (typeof value !== "string" || !isPolicyDenialReason(value)) {
    throw new Error(`${label} must be a valid policy denial reason.`);
  }

  return value;
}

function assertWirePolicyDecisionShape(value: PolicyWireDecision): void {
  switch (value.kind) {
    case "allow":
      return;
    case "deny":
    case "gate":
      assertWirePolicyDenialReason(value.reason, "reason");
      return;
    case "defer":
      if (value.reason !== undefined) {
        assertWirePolicyDenialReason(value.reason, "reason");
      }
      return;
    default: {
      const _exhaustive: never = value;
      throw new Error(`Unknown policy decision kind: ${String(_exhaustive)}.`);
    }
  }
}

/** Semantic guard for typed policy decisions before persistence or evaluation handoff. */
export function assertPolicyDecision(value: PolicyDecision): PolicyDecision {
  if (!isPolicyDecision(value)) {
    throw new Error("PolicyDecision failed semantic validation.");
  }

  return value;
}

/**
 * JSON ingress guard — narrow unknown wire payloads with strict keys, then run semantic asserts.
 * Fail closed before downstream evaluation or persistence.
 */
export function assertWirePolicyDecision(
  value: unknown
): asserts value is PolicyWireDecision {
  if (value === null || typeof value !== "object") {
    throw new Error("PolicyWireDecision must be an object.");
  }

  const record = value as Record<string, unknown>;
  const kind = record["kind"];

  if (typeof kind !== "string" || !isPolicyDecisionKind(kind)) {
    throw new Error("kind must be a valid policy decision kind.");
  }

  if (kind === "allow") {
    assertExactKeys(record, ["kind"]);
    assertWirePolicyDecisionShape({ kind: "allow" });
    return;
  }

  if (kind === "deny" || kind === "gate") {
    assertExactKeys(record, ["kind", "reason"]);
    const reason = assertWirePolicyDenialReason(record["reason"], "reason");
    assertWirePolicyDecisionShape({ kind, reason });
    return;
  }

  const reason = record["reason"];

  if (reason === undefined) {
    assertExactKeys(record, ["kind"]);
    assertWirePolicyDecisionShape({ kind: "defer" });
    return;
  }

  assertExactKeys(record, ["kind", "reason"]);
  const validatedReason = assertWirePolicyDenialReason(reason, "reason");
  assertWirePolicyDecisionShape({ kind: "defer", reason: validatedReason });
}
