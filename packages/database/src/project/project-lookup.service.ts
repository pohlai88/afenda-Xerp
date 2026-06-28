import { and, eq } from "drizzle-orm";

import type { ProjectLifecycleStatus } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { organizations } from "../schema/organization.schema.js";
import { projects } from "../schema/project.schema.js";

export interface ProjectLookupRow {
  readonly companyEnterpriseId: string;
  readonly companyId: string;
  readonly displayName: string;
  readonly enterpriseId: string;
  readonly id: string;
  readonly organizationUnitEnterpriseId: string | null;
  readonly organizationUnitId: string | null;
  readonly slug: string;
  readonly status: ProjectLifecycleStatus;
  readonly tenantId: string;
}

type ProjectLookupSelectRow = {
  readonly companyEnterpriseId: string | null;
  readonly companyId: string;
  readonly displayName: string;
  readonly enterpriseId: string | null;
  readonly id: string;
  readonly organizationUnitEnterpriseId: string | null;
  readonly organizationUnitId: string | null;
  readonly slug: string;
  readonly status: ProjectLifecycleStatus;
  readonly tenantId: string;
};

const projectLookupSelect = {
  id: projects.id,
  enterpriseId: projects.enterpriseId,
  tenantId: projects.tenantId,
  companyId: projects.companyId,
  companyEnterpriseId: companies.enterpriseId,
  organizationUnitId: projects.organizationUnitId,
  organizationUnitEnterpriseId: organizations.enterpriseId,
  slug: projects.slug,
  displayName: projects.displayName,
  status: projects.status,
} as const;

function toProjectLookupRow(
  row: ProjectLookupSelectRow | undefined
): ProjectLookupRow | null {
  if (!row || row.enterpriseId === null || row.companyEnterpriseId === null) {
    return null;
  }

  return {
    ...row,
    enterpriseId: row.enterpriseId,
    companyEnterpriseId: row.companyEnterpriseId,
  };
}

function projectLookupQuery(db: AfendaDatabase) {
  return db
    .select(projectLookupSelect)
    .from(projects)
    .innerJoin(companies, eq(projects.companyId, companies.id))
    .leftJoin(organizations, eq(projects.organizationUnitId, organizations.id));
}

export function isProjectOperational(
  row: Pick<ProjectLookupRow, "status">
): boolean {
  return row.status === "active";
}

export async function findProjectByTenantAndSlug(
  tenantId: string,
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<ProjectLookupRow | null> {
  const [row] = await projectLookupQuery(db)
    .where(and(eq(projects.tenantId, tenantId), eq(projects.slug, slug)))
    .limit(1);

  return toProjectLookupRow(row);
}

export async function findProjectById(
  projectId: string,
  db: AfendaDatabase = getDb()
): Promise<ProjectLookupRow | null> {
  const [row] = await projectLookupQuery(db)
    .where(eq(projects.id, projectId))
    .limit(1);

  return toProjectLookupRow(row);
}

export async function findProjectByEnterpriseId(
  enterpriseId: string,
  db: AfendaDatabase = getDb()
): Promise<ProjectLookupRow | null> {
  const [row] = await projectLookupQuery(db)
    .where(eq(projects.enterpriseId, enterpriseId))
    .limit(1);

  return toProjectLookupRow(row);
}
