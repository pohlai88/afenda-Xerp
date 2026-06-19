/**
 * Policy runtime validation — governed condition JSON (no I/O).
 *
 * Table: `schema/policy.schema.ts`
 * Contract: `policy.contract.ts`
 * Writes: `policy.service.ts`
 */

import type { PolicyEffect } from "../database.types.js";
import {
  assertPermissionKey,
  isPermissionKey,
} from "../permission-key.contract.js";

export const POLICY_CONDITION_VERSION = 1 as const;

export type PolicyGateDecision =
  | "require_approval"
  | "require_evidence"
  | "require_step_up"
  | "readonly";

export interface PolicyConditionMatch {
  readonly action?: string;
  readonly permissionKey?: string;
  readonly targetType?: string;
}

export interface PolicyConditionV1 {
  readonly gateDecision?: PolicyGateDecision;
  readonly match?: PolicyConditionMatch;
  readonly version: typeof POLICY_CONDITION_VERSION;
}

export type PolicyCondition = PolicyConditionV1;

export class InvalidPolicyConditionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPolicyConditionError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePolicyConditionMatch(value: unknown): PolicyConditionMatch {
  if (value === undefined) {
    return {};
  }

  if (!isRecord(value)) {
    throw new InvalidPolicyConditionError(
      "Policy condition match must be an object."
    );
  }

  const match: {
    permissionKey?: string;
    action?: string;
    targetType?: string;
  } = {};

  if (value.permissionKey !== undefined) {
    if (typeof value.permissionKey !== "string") {
      throw new InvalidPolicyConditionError(
        "Policy condition match.permissionKey must be a string."
      );
    }
    match.permissionKey = assertPermissionKey(value.permissionKey);
  }

  if (value.action !== undefined) {
    if (typeof value.action !== "string" || value.action.trim() === "") {
      throw new InvalidPolicyConditionError(
        "Policy condition match.action must be a non-empty string."
      );
    }
    match.action = value.action.trim().toLowerCase();
  }

  if (value.targetType !== undefined) {
    if (
      typeof value.targetType !== "string" ||
      value.targetType.trim() === ""
    ) {
      throw new InvalidPolicyConditionError(
        "Policy condition match.targetType must be a non-empty string."
      );
    }
    match.targetType = value.targetType.trim().toLowerCase();
  }

  return match;
}

const POLICY_GATE_DECISIONS = new Set<PolicyGateDecision>([
  "require_approval",
  "require_evidence",
  "require_step_up",
  "readonly",
]);

/** Validates governed policy condition JSON — rejects arbitrary metadata drift. */
export function parsePolicyCondition(value: unknown): PolicyCondition {
  if (
    value === null ||
    value === undefined ||
    (isRecord(value) && Object.keys(value).length === 0)
  ) {
    return { version: POLICY_CONDITION_VERSION, match: {} };
  }

  if (!isRecord(value)) {
    throw new InvalidPolicyConditionError(
      "Policy condition must be a JSON object."
    );
  }

  if (value.version !== POLICY_CONDITION_VERSION) {
    throw new InvalidPolicyConditionError(
      `Unsupported policy condition version "${String(value.version)}".`
    );
  }

  const match = parsePolicyConditionMatch(value.match);

  if (
    value.gateDecision !== undefined &&
    (typeof value.gateDecision !== "string" ||
      !POLICY_GATE_DECISIONS.has(value.gateDecision as PolicyGateDecision))
  ) {
    throw new InvalidPolicyConditionError(
      "Policy condition gateDecision is invalid."
    );
  }

  return {
    version: POLICY_CONDITION_VERSION,
    match,
    gateDecision: value.gateDecision as PolicyGateDecision | undefined,
  };
}

export function assertPolicyConditionForEffect(
  effect: PolicyEffect,
  condition: PolicyCondition
): void {
  if (effect === "deny" && condition.gateDecision !== undefined) {
    throw new InvalidPolicyConditionError(
      "Deny policies cannot set condition.gateDecision."
    );
  }
}

/** Returns true when a stored condition match aligns with evaluation input fields. */
export function policyConditionMatches(
  condition: PolicyCondition,
  input: {
    readonly permissionKey: string;
    readonly action: string;
    readonly targetType?: string | null;
  }
): boolean {
  const match = condition.match ?? {};

  if (match.permissionKey !== undefined) {
    if (!isPermissionKey(match.permissionKey)) {
      return false;
    }
    if (match.permissionKey !== input.permissionKey) {
      return false;
    }
  }

  if (match.action !== undefined && match.action !== input.action) {
    return false;
  }

  if (
    match.targetType !== undefined &&
    match.targetType !== (input.targetType ?? null)
  ) {
    return false;
  }

  return true;
}
