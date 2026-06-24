import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { organizations } from "../schema/organization.schema.js";
import { teams } from "../schema/team.schema.js";
import {
  buildTeamInsertRow,
  buildTeamUpdatePatch,
  type TeamUpdatePatch,
  type TeamWriteInput,
} from "./team.contract.js";

export class TeamScopeMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamScopeMismatchError";
  }
}

export interface TeamAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertTeamInput = TeamWriteInput & {
  readonly audit: TeamAuditContext;
};

export type UpdateTeamInput = TeamUpdatePatch & {
  readonly audit: TeamAuditContext;
};

export interface TeamMutationResult {
  readonly id: string;
}

async function assertTeamScopeChain(
  row: Pick<TeamWriteInput, "tenantId" | "companyId" | "organizationUnitId">,
  db: AfendaDatabase
): Promise<void> {
  const companyId = row.companyId ?? null;
  const organizationUnitId = row.organizationUnitId ?? null;

  if (companyId) {
    const [company] = await db
      .select({ tenantId: companies.tenantId })
      .from(companies)
      .where(eq(companies.id, companyId))
      .limit(1);

    if (!company || company.tenantId !== row.tenantId) {
      throw new TeamScopeMismatchError(
        "Team company must belong to the team tenant."
      );
    }
  }

  if (!organizationUnitId) {
    return;
  }

  const [organization] = await db
    .select({
      tenantId: organizations.tenantId,
      companyId: organizations.companyId,
    })
    .from(organizations)
    .where(eq(organizations.id, organizationUnitId))
    .limit(1);

  if (!organization || organization.tenantId !== row.tenantId) {
    throw new TeamScopeMismatchError(
      "Team organization unit must belong to the team tenant."
    );
  }

  if (companyId && organization.companyId !== companyId) {
    throw new TeamScopeMismatchError(
      "Team organization unit must belong to the team company."
    );
  }
}

async function recordTeamAuditEvent(
  action: "team.create" | "team.update",
  teamId: string,
  tenantId: string,
  audit: TeamAuditContext,
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
      targetType: "team",
      targetId: teamId,
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

export async function insertTeam(
  input: InsertTeamInput,
  db: AfendaDatabase = getDb()
): Promise<TeamMutationResult> {
  const row = buildTeamInsertRow(input);
  await assertTeamScopeChain(row, db);

  const [inserted] = await db
    .insert(teams)
    .values(row)
    .returning({ id: teams.id, tenantId: teams.tenantId });

  if (!inserted) {
    throw new Error("Team insert did not return a row id.");
  }

  await recordTeamAuditEvent(
    "team.create",
    inserted.id,
    inserted.tenantId,
    input.audit,
    {
      slug: row.slug,
      displayName: row.displayName,
      status: row.status,
      companyId: row.companyId,
      organizationUnitId: row.organizationUnitId,
    },
    db
  );

  return { id: inserted.id };
}

export async function updateTeam(
  teamId: string,
  input: UpdateTeamInput,
  db: AfendaDatabase = getDb()
): Promise<TeamMutationResult> {
  const patch = buildTeamUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Team update requires at least one field.");
  }

  const [existing] = await db
    .select({
      id: teams.id,
      tenantId: teams.tenantId,
      companyId: teams.companyId,
    })
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1);

  if (!existing) {
    throw new Error(`Team "${teamId}" was not found.`);
  }

  if (patch.companyId !== undefined || patch.organizationUnitId !== undefined) {
    await assertTeamScopeChain(
      {
        tenantId: existing.tenantId,
        companyId: patch.companyId ?? existing.companyId,
        organizationUnitId: patch.organizationUnitId ?? null,
      },
      db
    );
  }

  const [updated] = await db
    .update(teams)
    .set(patch)
    .where(eq(teams.id, teamId))
    .returning({ id: teams.id });

  if (!updated) {
    throw new Error(`Team "${teamId}" was not found.`);
  }

  await recordTeamAuditEvent(
    "team.update",
    updated.id,
    existing.tenantId,
    input.audit,
    {
      slug: patch.slug ?? null,
      displayName: patch.displayName ?? null,
      status: patch.status ?? null,
      companyId: patch.companyId ?? null,
      organizationUnitId: patch.organizationUnitId ?? null,
    },
    db
  );

  return { id: updated.id };
}
