/**
 * Policy write governance — types and pure builders (no I/O).
 *
 * Table: `schema/policy.schema.ts`
 * Validation: `policy.validation.ts`
 * Writes: `policy.service.ts`
 */
import type {
  PolicyEffect,
  PolicyScope,
  PolicyStatus,
} from "../database.types.js";
import {
  assertRoleKey,
  InvalidRoleKeyError,
  normalizeRoleKey,
} from "../role/role.contract.js";
import {
  assertPolicyConditionForEffect,
  type PolicyCondition,
  parsePolicyCondition,
} from "./policy.validation.js";

export const DEFAULT_POLICY_PRIORITY = 100 as const;
export const MIN_POLICY_PRIORITY = 1 as const;
export const MAX_POLICY_PRIORITY = 10_000 as const;

export class InvalidPolicyKeyError extends InvalidRoleKeyError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPolicyKeyError";
  }
}

export class PolicyScopeTenantMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyScopeTenantMismatchError";
  }
}

export class PolicyKeyImmutableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyKeyImmutableError";
  }
}

export class InvalidPolicyPriorityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPolicyPriorityError";
  }
}

export function normalizePolicyKey(value: string): string {
  return normalizeRoleKey(value);
}

/** Canonical dot-case policy keys, e.g. `approval.purchase_order.amount_limit`. */
export function assertPolicyKey(value: string): string {
  try {
    return assertRoleKey(value);
  } catch (error) {
    if (error instanceof InvalidRoleKeyError) {
      throw new InvalidPolicyKeyError(error.message);
    }
    throw error;
  }
}

export function assertPolicyScopeMatchesTenant(
  scope: PolicyScope,
  tenantId: string | null
): void {
  if (scope === "platform") {
    if (tenantId !== null) {
      throw new PolicyScopeTenantMismatchError(
        "Platform-scoped policies must have tenantId = null."
      );
    }
    return;
  }

  if (tenantId === null || tenantId.trim() === "") {
    throw new PolicyScopeTenantMismatchError(
      `Scope "${scope}" requires a tenantId. Platform scope is the only tenant-less policy scope.`
    );
  }
}

export function assertPolicyPriority(value: number): number {
  if (!Number.isInteger(value)) {
    throw new InvalidPolicyPriorityError("Policy priority must be an integer.");
  }

  if (value < MIN_POLICY_PRIORITY || value > MAX_POLICY_PRIORITY) {
    throw new InvalidPolicyPriorityError(
      `Policy priority must be between ${MIN_POLICY_PRIORITY} and ${MAX_POLICY_PRIORITY}.`
    );
  }

  return value;
}

export function isPolicyOperational(
  policy: Pick<PolicyRecord, "status">
): boolean {
  return policy.status === "active";
}

export interface PolicyWriteInput {
  readonly condition?: unknown;
  readonly description?: string | null;
  readonly effect: PolicyEffect;
  readonly key: string;
  readonly name: string;
  readonly priority?: number;
  readonly scope: PolicyScope;
  readonly status?: PolicyStatus;
  readonly tenantId: string | null;
}

export interface PolicyInsertRow {
  condition: PolicyCondition;
  description: string | null;
  effect: PolicyEffect;
  key: string;
  name: string;
  priority: number;
  scope: PolicyScope;
  status: PolicyStatus;
  tenantId: string | null;
}

export type PolicyRecord = PolicyInsertRow;

/** Policy key, tenantId, and scope are immutable after create. */
export type PolicyUpdatePatch = Partial<
  Pick<
    PolicyInsertRow,
    "name" | "description" | "effect" | "priority" | "condition" | "status"
  >
> & {
  readonly key?: never;
  readonly tenantId?: never;
  readonly scope?: never;
};

export function buildPolicyInsertRow(input: PolicyWriteInput): PolicyInsertRow {
  assertPolicyScopeMatchesTenant(input.scope, input.tenantId);
  const condition = parsePolicyCondition(input.condition);
  assertPolicyConditionForEffect(input.effect, condition);

  return {
    tenantId: input.tenantId,
    key: assertPolicyKey(input.key),
    name: input.name.trim(),
    description: input.description?.trim() || null,
    scope: input.scope,
    effect: input.effect,
    priority: assertPolicyPriority(input.priority ?? DEFAULT_POLICY_PRIORITY),
    condition,
    status: input.status ?? "active",
  };
}

export function buildPolicyUpdatePatch(
  input: PolicyUpdatePatch
): PolicyUpdatePatch {
  if ("key" in input && input.key !== undefined) {
    throw new PolicyKeyImmutableError("Policy key is immutable after create.");
  }
  if ("tenantId" in input && input.tenantId !== undefined) {
    throw new PolicyKeyImmutableError(
      "Policy tenantId is immutable after create."
    );
  }
  if ("scope" in input && input.scope !== undefined) {
    throw new PolicyKeyImmutableError(
      "Policy scope is immutable after create."
    );
  }

  const patch: PolicyUpdatePatch = {};

  if (input.name !== undefined) {
    patch.name = input.name.trim();
  }
  if (input.description !== undefined) {
    patch.description = input.description?.trim() || null;
  }
  if (input.effect !== undefined) {
    patch.effect = input.effect;
  }
  if (input.priority !== undefined) {
    patch.priority = assertPolicyPriority(input.priority);
  }
  if (input.condition !== undefined) {
    patch.condition = parsePolicyCondition(input.condition);
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }

  if (patch.effect !== undefined || patch.condition !== undefined) {
    const effect = patch.effect;
    const condition = patch.condition;
    if (effect !== undefined && condition !== undefined) {
      assertPolicyConditionForEffect(effect, condition);
    }
  }

  return patch;
}
