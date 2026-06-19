import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { policies } from "../schema/policy.schema.js";
import {
  buildPolicyInsertRow,
  buildPolicyUpdatePatch,
  type PolicyUpdatePatch,
  type PolicyWriteInput,
} from "./policy.contract.js";
import {
  assertPolicyConditionForEffect,
  parsePolicyCondition,
} from "./policy.validation.js";

export interface PolicyAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertPolicyInput = PolicyWriteInput & {
  readonly audit: PolicyAuditContext;
};

export type UpdatePolicyInput = PolicyUpdatePatch & {
  readonly audit: PolicyAuditContext;
};

export interface ArchivePolicyInput {
  readonly audit: PolicyAuditContext;
  readonly reason?: string | null;
}

export interface PolicyMutationResult {
  readonly id: string;
}

async function recordPolicyAuditEvent(
  action: "policy.create" | "policy.update" | "policy.archive",
  tenantId: string | null,
  policyId: string,
  audit: PolicyAuditContext,
  metadata: Record<string, string | null>,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      tenantId,
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "platform",
      action,
      targetType: "policy",
      targetId: policyId,
      result: "success",
      source: audit.source ?? "app",
      correlationId: audit.correlationId,
      ipAddress: audit.ipAddress ?? null,
      userAgent: audit.userAgent ?? null,
      metadata,
    },
    db
  );
}

/**
 * Governed policy create path.
 *
 * Policy is the authority decision template — not the grant. Do not insert into
 * `policies` directly from feature modules.
 */
export async function insertPolicy(
  input: InsertPolicyInput,
  db: AfendaDatabase = getDb()
): Promise<PolicyMutationResult> {
  const row = buildPolicyInsertRow(input);

  const [inserted] = await db
    .insert(policies)
    .values(row)
    .returning({ id: policies.id });

  if (!inserted) {
    throw new Error("Policy insert did not return a row id.");
  }

  await recordPolicyAuditEvent(
    "policy.create",
    row.tenantId,
    inserted.id,
    input.audit,
    {
      key: row.key,
      name: row.name,
      scope: row.scope,
      effect: row.effect,
      priority: String(row.priority),
      status: row.status,
    },
    db
  );

  return { id: inserted.id };
}

export async function updatePolicy(
  policyId: string,
  input: UpdatePolicyInput,
  db: AfendaDatabase = getDb()
): Promise<PolicyMutationResult> {
  const patch = buildPolicyUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Policy update requires at least one field.");
  }

  const [existing] = await db
    .select({
      id: policies.id,
      tenantId: policies.tenantId,
      effect: policies.effect,
      status: policies.status,
    })
    .from(policies)
    .where(eq(policies.id, policyId))
    .limit(1);

  if (!existing) {
    throw new Error(`Policy "${policyId}" was not found.`);
  }

  if (patch.effect !== undefined || patch.condition !== undefined) {
    const [current] = await db
      .select({ condition: policies.condition })
      .from(policies)
      .where(eq(policies.id, policyId))
      .limit(1);

    const nextEffect = patch.effect ?? existing.effect;
    const nextCondition =
      patch.condition ?? parsePolicyCondition(current?.condition);

    assertPolicyConditionForEffect(nextEffect, nextCondition);
  }

  const [updated] = await db
    .update(policies)
    .set(patch)
    .where(eq(policies.id, policyId))
    .returning({ id: policies.id });

  if (!updated) {
    throw new Error(`Policy "${policyId}" was not found.`);
  }

  await recordPolicyAuditEvent(
    "policy.update",
    existing.tenantId,
    updated.id,
    input.audit,
    {
      name: patch.name ?? null,
      effect: patch.effect ?? null,
      priority: patch.priority === undefined ? null : String(patch.priority),
      status: patch.status ?? null,
    },
    db
  );

  return { id: updated.id };
}

/** Archives a policy without hard delete. Normal app code must not delete policies. */
export async function archivePolicy(
  policyId: string,
  input: ArchivePolicyInput,
  db: AfendaDatabase = getDb()
): Promise<PolicyMutationResult> {
  const [existing] = await db
    .select({
      id: policies.id,
      tenantId: policies.tenantId,
      status: policies.status,
    })
    .from(policies)
    .where(eq(policies.id, policyId))
    .limit(1);

  if (!existing || existing.status === "archived") {
    throw new Error(`Active policy "${policyId}" was not found.`);
  }

  const [updated] = await db
    .update(policies)
    .set({ status: "archived" })
    .where(eq(policies.id, policyId))
    .returning({ id: policies.id });

  if (!updated) {
    throw new Error(`Policy "${policyId}" was not found.`);
  }

  await recordPolicyAuditEvent(
    "policy.archive",
    existing.tenantId,
    updated.id,
    input.audit,
    {
      reason: input.reason ?? null,
      status: "archived",
    },
    db
  );

  return { id: updated.id };
}
