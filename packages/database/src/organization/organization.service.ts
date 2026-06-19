import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { organizations } from "../schema/organization.schema.js";
import {
  assertNoOrganizationCycle,
  buildOrganizationInsertRow,
  buildOrganizationUpdatePatch,
  OrganizationCycleError,
  OrganizationHasChildrenError,
  OrganizationParentNotFoundError,
  OrganizationScopeMismatchError,
  type OrganizationUpdatePatch,
  type OrganizationWriteInput,
} from "./organization.contract.js";

export interface OrganizationAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertOrganizationInput = OrganizationWriteInput & {
  readonly audit: OrganizationAuditContext;
};

export type UpdateOrganizationInput = OrganizationUpdatePatch & {
  readonly audit: OrganizationAuditContext;
};

export interface DeleteOrganizationInput {
  readonly audit: OrganizationAuditContext;
}

export interface OrganizationMutationResult {
  readonly id: string;
}

async function assertCompanyBelongsToTenant(
  tenantId: string,
  companyId: string,
  db: AfendaDatabase
): Promise<void> {
  const [company] = await db
    .select({ tenantId: companies.tenantId })
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (!company || company.tenantId !== tenantId) {
    throw new OrganizationScopeMismatchError(
      "Company must belong to the same tenant as the organization."
    );
  }
}

async function loadOrganizationScope(
  organizationId: string,
  db: AfendaDatabase
): Promise<{ tenantId: string; companyId: string }> {
  const [organization] = await db
    .select({
      tenantId: organizations.tenantId,
      companyId: organizations.companyId,
    })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  if (!organization) {
    throw new Error(`Organization "${organizationId}" was not found.`);
  }

  return organization;
}

async function assertParentOrganizationScope(
  tenantId: string,
  companyId: string,
  parentOrganizationId: string | null,
  db: AfendaDatabase
): Promise<void> {
  if (!parentOrganizationId) {
    return;
  }

  const [parent] = await db
    .select({
      tenantId: organizations.tenantId,
      companyId: organizations.companyId,
    })
    .from(organizations)
    .where(eq(organizations.id, parentOrganizationId))
    .limit(1);

  if (!parent) {
    throw new OrganizationParentNotFoundError(
      `Parent organization "${parentOrganizationId}" was not found.`
    );
  }

  if (parent.tenantId !== tenantId || parent.companyId !== companyId) {
    throw new OrganizationScopeMismatchError(
      "Parent organization must belong to the same tenant and company."
    );
  }
}

async function assertOrganizationTreeValid(
  organizationId: string | null,
  tenantId: string,
  companyId: string,
  parentOrganizationId: string | null,
  db: AfendaDatabase
): Promise<void> {
  await assertCompanyBelongsToTenant(tenantId, companyId, db);
  await assertParentOrganizationScope(
    tenantId,
    companyId,
    parentOrganizationId,
    db
  );

  const parentMap = new Map<string, string | null>();

  if (parentOrganizationId) {
    let currentId: string | null = parentOrganizationId;

    while (currentId) {
      if (parentMap.has(currentId)) {
        break;
      }

      const [row] = await db
        .select({
          parentOrganizationId: organizations.parentOrganizationId,
        })
        .from(organizations)
        .where(eq(organizations.id, currentId))
        .limit(1);

      parentMap.set(currentId, row?.parentOrganizationId ?? null);
      currentId = row?.parentOrganizationId ?? null;
    }
  }

  assertNoOrganizationCycle(organizationId, parentOrganizationId, (id) => {
    if (parentMap.has(id)) {
      return parentMap.get(id);
    }

    throw new OrganizationCycleError(
      "Organization hierarchy cannot contain a cycle."
    );
  });
}

async function recordOrganizationAuditEvent(
  action: "organization.create" | "organization.update" | "organization.delete",
  organizationId: string,
  tenantId: string,
  companyId: string,
  audit: OrganizationAuditContext,
  metadata: Record<string, string | null>
): Promise<void> {
  await insertAuditEvent({
    tenantId,
    companyId,
    organizationId,
    actorType: audit.actorType,
    actorUserId: audit.actorUserId ?? null,
    module: "platform",
    action,
    targetType: "organization",
    targetId: organizationId,
    result: "success",
    source: audit.source ?? "app",
    correlationId: audit.correlationId,
    ipAddress: audit.ipAddress ?? null,
    userAgent: audit.userAgent ?? null,
    metadata,
  });
}

export async function insertOrganization(
  input: InsertOrganizationInput,
  db: AfendaDatabase = getDb()
): Promise<OrganizationMutationResult> {
  const row = buildOrganizationInsertRow(input);

  await assertOrganizationTreeValid(
    null,
    row.tenantId,
    row.companyId,
    row.parentOrganizationId,
    db
  );

  const [inserted] = await db.insert(organizations).values(row).returning({
    id: organizations.id,
    tenantId: organizations.tenantId,
    companyId: organizations.companyId,
  });

  if (!inserted) {
    throw new Error("Organization insert did not return a row id.");
  }

  await recordOrganizationAuditEvent(
    "organization.create",
    inserted.id,
    inserted.tenantId,
    inserted.companyId,
    input.audit,
    {
      slug: row.slug,
      name: row.name,
      parentOrganizationId: row.parentOrganizationId,
      type: row.type,
    }
  );

  return { id: inserted.id };
}

export async function updateOrganization(
  organizationId: string,
  input: UpdateOrganizationInput,
  db: AfendaDatabase = getDb()
): Promise<OrganizationMutationResult> {
  const patch = buildOrganizationUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Organization update requires at least one field.");
  }

  const scope = await loadOrganizationScope(organizationId, db);
  const nextParentOrganizationId =
    patch.parentOrganizationId === undefined
      ? undefined
      : patch.parentOrganizationId;

  if (nextParentOrganizationId !== undefined) {
    await assertOrganizationTreeValid(
      organizationId,
      scope.tenantId,
      scope.companyId,
      nextParentOrganizationId,
      db
    );
  }

  const [updated] = await db
    .update(organizations)
    .set(patch)
    .where(eq(organizations.id, organizationId))
    .returning({
      id: organizations.id,
      tenantId: organizations.tenantId,
      companyId: organizations.companyId,
    });

  if (!updated) {
    throw new Error(`Organization "${organizationId}" was not found.`);
  }

  await recordOrganizationAuditEvent(
    "organization.update",
    updated.id,
    updated.tenantId,
    updated.companyId,
    input.audit,
    {
      slug: patch.slug ?? null,
      name: patch.name ?? null,
      parentOrganizationId:
        patch.parentOrganizationId === undefined
          ? null
          : patch.parentOrganizationId,
      status: patch.status ?? null,
    }
  );

  return { id: updated.id };
}

export async function deleteOrganization(
  organizationId: string,
  input: DeleteOrganizationInput,
  db: AfendaDatabase = getDb()
): Promise<OrganizationMutationResult> {
  await loadOrganizationScope(organizationId, db);

  const [child] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.parentOrganizationId, organizationId))
    .limit(1);

  if (child) {
    throw new OrganizationHasChildrenError(
      "Cannot delete an organization that still has child organizations."
    );
  }

  const [deleted] = await db
    .delete(organizations)
    .where(eq(organizations.id, organizationId))
    .returning({
      id: organizations.id,
      tenantId: organizations.tenantId,
      companyId: organizations.companyId,
    });

  if (!deleted) {
    throw new Error(`Organization "${organizationId}" was not found.`);
  }

  await recordOrganizationAuditEvent(
    "organization.delete",
    deleted.id,
    deleted.tenantId,
    deleted.companyId,
    input.audit,
    {}
  );

  return { id: deleted.id };
}
