import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import {
  buildCompanyInsertRow,
  buildCompanyUpdatePatch,
  type CompanyUpdatePatch,
  type CompanyWriteInput,
} from "./company.contract.js";

export interface CompanyAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertCompanyInput = CompanyWriteInput & {
  readonly audit: CompanyAuditContext;
};

export type UpdateCompanyInput = CompanyUpdatePatch & {
  readonly audit: CompanyAuditContext;
};

export interface CompanyMutationResult {
  readonly id: string;
}

async function recordCompanyAuditEvent(
  action: "company.create" | "company.update",
  companyId: string,
  tenantId: string,
  audit: CompanyAuditContext,
  metadata: Record<string, string | null>
): Promise<void> {
  await insertAuditEvent({
    tenantId,
    companyId,
    actorType: audit.actorType,
    actorUserId: audit.actorUserId ?? null,
    module: "platform",
    action,
    targetType: "company",
    targetId: companyId,
    result: "success",
    source: audit.source ?? "app",
    correlationId: audit.correlationId,
    ipAddress: audit.ipAddress ?? null,
    userAgent: audit.userAgent ?? null,
    metadata,
  });
}

/**
 * Governed company create path.
 * Do not insert into `companies` directly from feature modules.
 */
export async function insertCompany(
  input: InsertCompanyInput,
  db: AfendaDatabase = getDb()
): Promise<CompanyMutationResult> {
  const row = buildCompanyInsertRow(input);

  const [inserted] = await db
    .insert(companies)
    .values(row)
    .returning({ id: companies.id, tenantId: companies.tenantId });

  if (!inserted) {
    throw new Error("Company insert did not return a row id.");
  }

  await recordCompanyAuditEvent(
    "company.create",
    inserted.id,
    inserted.tenantId,
    input.audit,
    {
      slug: row.slug,
      legalName: row.legalName,
      countryCode: row.countryCode,
      baseCurrency: row.baseCurrency,
    }
  );

  return { id: inserted.id };
}

/**
 * Governed company update path.
 * Do not update `companies` directly from feature modules.
 */
export async function updateCompany(
  companyId: string,
  input: UpdateCompanyInput,
  db: AfendaDatabase = getDb()
): Promise<CompanyMutationResult> {
  const patch = buildCompanyUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Company update requires at least one field.");
  }

  const [updated] = await db
    .update(companies)
    .set(patch)
    .where(eq(companies.id, companyId))
    .returning({ id: companies.id, tenantId: companies.tenantId });

  if (!updated) {
    throw new Error(`Company "${companyId}" was not found.`);
  }

  await recordCompanyAuditEvent(
    "company.update",
    updated.id,
    updated.tenantId,
    input.audit,
    {
      slug: patch.slug ?? null,
      legalName: patch.legalName ?? null,
      countryCode: patch.countryCode ?? null,
      baseCurrency: patch.baseCurrency ?? null,
      status: patch.status ?? null,
    }
  );

  return { id: updated.id };
}
