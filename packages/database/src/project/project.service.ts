import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { organizations } from "../schema/organization.schema.js";
import { projects } from "../schema/project.schema.js";
import {
  buildProjectInsertRow,
  buildProjectUpdatePatch,
  type ProjectUpdatePatch,
  type ProjectWriteInput,
} from "./project.contract.js";

export class ProjectScopeMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectScopeMismatchError";
  }
}

export interface ProjectAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertProjectInput = ProjectWriteInput & {
  readonly audit: ProjectAuditContext;
};

export type UpdateProjectInput = ProjectUpdatePatch & {
  readonly audit: ProjectAuditContext;
};

export interface ProjectMutationResult {
  readonly id: string;
}

async function assertProjectScopeChain(
  row: Pick<ProjectWriteInput, "tenantId" | "companyId" | "organizationUnitId">,
  db: AfendaDatabase
): Promise<void> {
  const [company] = await db
    .select({ tenantId: companies.tenantId })
    .from(companies)
    .where(eq(companies.id, row.companyId))
    .limit(1);

  if (!company || company.tenantId !== row.tenantId) {
    throw new ProjectScopeMismatchError(
      "Project company must belong to the project tenant."
    );
  }

  const organizationUnitId = row.organizationUnitId ?? null;
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
    throw new ProjectScopeMismatchError(
      "Project organization unit must belong to the project tenant."
    );
  }

  if (organization.companyId !== row.companyId) {
    throw new ProjectScopeMismatchError(
      "Project organization unit must belong to the project company."
    );
  }
}

async function recordProjectAuditEvent(
  action: "project.create" | "project.update",
  projectId: string,
  tenantId: string,
  audit: ProjectAuditContext,
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
      targetType: "project",
      targetId: projectId,
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

export async function insertProject(
  input: InsertProjectInput,
  db: AfendaDatabase = getDb()
): Promise<ProjectMutationResult> {
  const row = buildProjectInsertRow(input);
  await assertProjectScopeChain(row, db);

  const [inserted] = await db
    .insert(projects)
    .values(row)
    .returning({ id: projects.id, tenantId: projects.tenantId });

  if (!inserted) {
    throw new Error("Project insert did not return a row id.");
  }

  await recordProjectAuditEvent(
    "project.create",
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

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput,
  db: AfendaDatabase = getDb()
): Promise<ProjectMutationResult> {
  const patch = buildProjectUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Project update requires at least one field.");
  }

  const [existing] = await db
    .select({
      id: projects.id,
      tenantId: projects.tenantId,
      companyId: projects.companyId,
    })
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!existing) {
    throw new Error(`Project "${projectId}" was not found.`);
  }

  if (patch.organizationUnitId !== undefined) {
    await assertProjectScopeChain(
      {
        tenantId: existing.tenantId,
        companyId: existing.companyId,
        organizationUnitId: patch.organizationUnitId,
      },
      db
    );
  }

  const [updated] = await db
    .update(projects)
    .set(patch)
    .where(eq(projects.id, projectId))
    .returning({ id: projects.id });

  if (!updated) {
    throw new Error(`Project "${projectId}" was not found.`);
  }

  await recordProjectAuditEvent(
    "project.update",
    updated.id,
    existing.tenantId,
    input.audit,
    {
      slug: patch.slug ?? null,
      displayName: patch.displayName ?? null,
      status: patch.status ?? null,
      organizationUnitId: patch.organizationUnitId ?? null,
    },
    db
  );

  return { id: updated.id };
}
