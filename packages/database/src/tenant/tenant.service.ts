import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { tenants } from "../schema/tenant.schema.js";
import {
  buildTenantInsertRow,
  buildTenantUpdatePatch,
  type TenantUpdatePatch,
  type TenantWriteInput,
} from "./tenant.contract.js";

export interface TenantAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertTenantInput = TenantWriteInput & {
  readonly audit: TenantAuditContext;
};

export type UpdateTenantInput = TenantUpdatePatch & {
  readonly audit: TenantAuditContext;
};

export interface ArchiveTenantInput {
  readonly audit: TenantAuditContext;
  readonly reason?: string | null;
}

export interface TenantMutationResult {
  readonly id: string;
}

async function recordTenantAuditEvent(
  action: "tenant.create" | "tenant.update" | "tenant.archive",
  tenantId: string,
  audit: TenantAuditContext,
  metadata: Record<string, string | null>
): Promise<void> {
  await insertAuditEvent({
    tenantId,
    actorType: audit.actorType,
    actorUserId: audit.actorUserId ?? null,
    module: "platform",
    action,
    targetType: "tenant",
    targetId: tenantId,
    result: "success",
    source: audit.source ?? "app",
    correlationId: audit.correlationId,
    ipAddress: audit.ipAddress ?? null,
    userAgent: audit.userAgent ?? null,
    metadata,
  });
}

/**
 * Governed tenant create path.
 *
 * Tenant is the hard platform isolation boundary. Do not insert into `tenants`
 * directly from feature modules.
 */
export async function insertTenant(
  input: InsertTenantInput,
  db: AfendaDatabase = getDb()
): Promise<TenantMutationResult> {
  const row = buildTenantInsertRow(input);

  const [inserted] = await db
    .insert(tenants)
    .values(row)
    .returning({ id: tenants.id });

  if (!inserted) {
    throw new Error("Tenant insert did not return a row id.");
  }

  await recordTenantAuditEvent("tenant.create", inserted.id, input.audit, {
    slug: row.slug,
    name: row.name,
    status: row.status,
  });

  return { id: inserted.id };
}

export async function updateTenant(
  tenantId: string,
  input: UpdateTenantInput,
  db: AfendaDatabase = getDb()
): Promise<TenantMutationResult> {
  const patch = buildTenantUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Tenant update requires at least one field.");
  }

  const [updated] = await db
    .update(tenants)
    .set(patch)
    .where(eq(tenants.id, tenantId))
    .returning({ id: tenants.id });

  if (!updated) {
    throw new Error(`Tenant "${tenantId}" was not found.`);
  }

  await recordTenantAuditEvent("tenant.update", updated.id, input.audit, {
    slug: patch.slug ?? null,
    name: patch.name ?? null,
    status: patch.status ?? null,
  });

  return { id: updated.id };
}

/** Archives a tenant without hard delete. Normal app code must not delete tenants. */
export async function archiveTenant(
  tenantId: string,
  input: ArchiveTenantInput,
  db: AfendaDatabase = getDb()
): Promise<TenantMutationResult> {
  const [existing] = await db
    .select({ id: tenants.id, status: tenants.status })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);

  if (!existing || existing.status === "archived") {
    throw new Error(`Active tenant "${tenantId}" was not found.`);
  }

  const [updated] = await db
    .update(tenants)
    .set({ status: "archived" })
    .where(eq(tenants.id, tenantId))
    .returning({ id: tenants.id });

  if (!updated) {
    throw new Error(`Tenant "${tenantId}" was not found.`);
  }

  await recordTenantAuditEvent("tenant.archive", updated.id, input.audit, {
    reason: input.reason ?? null,
    status: "archived",
  });

  return { id: updated.id };
}
