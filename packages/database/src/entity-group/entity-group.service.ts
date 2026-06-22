import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { entityGroups } from "../schema/entity-group.schema.js";
import {
  buildEntityGroupInsertRow,
  buildEntityGroupUpdatePatch,
  type EntityGroupUpdatePatch,
  type EntityGroupWriteInput,
} from "./entity-group.contract.js";

export class EntityGroupScopeMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntityGroupScopeMismatchError";
  }
}

export interface EntityGroupAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertEntityGroupInput = EntityGroupWriteInput & {
  readonly audit: EntityGroupAuditContext;
};

export type UpdateEntityGroupInput = EntityGroupUpdatePatch & {
  readonly audit: EntityGroupAuditContext;
};

export interface EntityGroupMutationResult {
  readonly id: string;
}

async function assertParentLegalEntityBelongsToTenant(
  tenantId: string,
  parentLegalEntityId: string | null,
  db: AfendaDatabase
): Promise<void> {
  if (!parentLegalEntityId) {
    return;
  }

  const [company] = await db
    .select({ tenantId: companies.tenantId })
    .from(companies)
    .where(eq(companies.id, parentLegalEntityId))
    .limit(1);

  if (!company || company.tenantId !== tenantId) {
    throw new EntityGroupScopeMismatchError(
      "Entity group parent legal entity must belong to the same tenant."
    );
  }
}

async function recordEntityGroupAuditEvent(
  action: "entity_group.create" | "entity_group.update",
  entityGroupId: string,
  tenantId: string,
  audit: EntityGroupAuditContext,
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
      targetType: "entity_group",
      targetId: entityGroupId,
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

export async function insertEntityGroup(
  input: InsertEntityGroupInput,
  db: AfendaDatabase = getDb()
): Promise<EntityGroupMutationResult> {
  const row = buildEntityGroupInsertRow(input);
  await assertParentLegalEntityBelongsToTenant(
    row.tenantId,
    row.parentLegalEntityId,
    db
  );

  const [inserted] = await db
    .insert(entityGroups)
    .values(row)
    .returning({ id: entityGroups.id, tenantId: entityGroups.tenantId });

  if (!inserted) {
    throw new Error("Entity group insert did not return a row id.");
  }

  await recordEntityGroupAuditEvent(
    "entity_group.create",
    inserted.id,
    inserted.tenantId,
    input.audit,
    {
      slug: row.slug,
      displayName: row.displayName,
      status: row.status,
      parentLegalEntityId: row.parentLegalEntityId,
    },
    db
  );

  return { id: inserted.id };
}

export async function updateEntityGroup(
  entityGroupId: string,
  input: UpdateEntityGroupInput,
  db: AfendaDatabase = getDb()
): Promise<EntityGroupMutationResult> {
  const patch = buildEntityGroupUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Entity group update requires at least one field.");
  }

  const [existing] = await db
    .select({ id: entityGroups.id, tenantId: entityGroups.tenantId })
    .from(entityGroups)
    .where(eq(entityGroups.id, entityGroupId))
    .limit(1);

  if (!existing) {
    throw new Error(`Entity group "${entityGroupId}" was not found.`);
  }

  if (patch.parentLegalEntityId !== undefined) {
    await assertParentLegalEntityBelongsToTenant(
      existing.tenantId,
      patch.parentLegalEntityId,
      db
    );
  }

  const [updated] = await db
    .update(entityGroups)
    .set(patch)
    .where(eq(entityGroups.id, entityGroupId))
    .returning({ id: entityGroups.id });

  if (!updated) {
    throw new Error(`Entity group "${entityGroupId}" was not found.`);
  }

  await recordEntityGroupAuditEvent(
    "entity_group.update",
    updated.id,
    existing.tenantId,
    input.audit,
    {
      slug: patch.slug ?? null,
      displayName: patch.displayName ?? null,
      status: patch.status ?? null,
      parentLegalEntityId: patch.parentLegalEntityId ?? null,
    },
    db
  );

  return { id: updated.id };
}
