import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { entityGroups } from "../schema/entity-group.schema.js";
import { legalEntityOwnership } from "../schema/legal-entity-ownership.schema.js";
import {
  buildOwnershipInterestInsertRow,
  type OwnershipInterestWriteInput,
} from "./ownership-interest.contract.js";

export class OwnershipInterestScopeMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OwnershipInterestScopeMismatchError";
  }
}

export interface OwnershipInterestAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertOwnershipInterestInput = OwnershipInterestWriteInput & {
  readonly audit: OwnershipInterestAuditContext;
};

export interface OwnershipInterestMutationResult {
  readonly id: string;
}

async function assertOwnershipScopeChain(
  row: Pick<
    OwnershipInterestWriteInput,
    "tenantId" | "entityGroupId" | "parentLegalEntityId"
  > & {
    readonly childLegalEntityId: string;
  },
  db: AfendaDatabase
): Promise<void> {
  const [group] = await db
    .select({ tenantId: entityGroups.tenantId })
    .from(entityGroups)
    .where(eq(entityGroups.id, row.entityGroupId))
    .limit(1);

  if (!group || group.tenantId !== row.tenantId) {
    throw new OwnershipInterestScopeMismatchError(
      "Ownership interest entity group must belong to the tenant."
    );
  }

  for (const companyId of [row.parentLegalEntityId, row.childLegalEntityId]) {
    const [company] = await db
      .select({ tenantId: companies.tenantId })
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!company || company.tenantId !== row.tenantId) {
      throw new OwnershipInterestScopeMismatchError(
        "Ownership interest legal entities must belong to the tenant."
      );
    }
  }
}

async function recordOwnershipInterestAuditEvent(
  ownershipInterestId: string,
  tenantId: string,
  audit: OwnershipInterestAuditContext,
  metadata: Record<string, string | null>,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      tenantId,
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "platform",
      action: "ownership_interest.create",
      targetType: "ownership_interest",
      targetId: ownershipInterestId,
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

export async function insertOwnershipInterest(
  input: InsertOwnershipInterestInput,
  db: AfendaDatabase = getDb()
): Promise<OwnershipInterestMutationResult> {
  const row = buildOwnershipInterestInsertRow(input);
  await assertOwnershipScopeChain(row, db);

  const [inserted] = await db
    .insert(legalEntityOwnership)
    .values(row)
    .returning({ id: legalEntityOwnership.id, tenantId: legalEntityOwnership.tenantId });

  if (!inserted) {
    throw new Error("Ownership interest insert did not return a row id.");
  }

  await recordOwnershipInterestAuditEvent(
    inserted.id,
    inserted.tenantId,
    input.audit,
    {
      entityGroupId: row.entityGroupId,
      parentLegalEntityId: row.parentLegalEntityId,
      childLegalEntityId: row.childLegalEntityId,
      controlType: row.controlType,
      relationshipType: row.relationshipType,
      consolidationMethod: row.consolidationMethod,
      nonControllingInterestApplicable: String(
        row.nonControllingInterestApplicable
      ),
      effectiveFrom: row.effectiveFrom,
      effectiveTo: row.effectiveTo,
      status: row.status,
    },
    db
  );

  return { id: inserted.id };
}
