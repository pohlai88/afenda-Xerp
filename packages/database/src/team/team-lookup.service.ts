import { and, eq } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { organizations } from "../schema/organization.schema.js";
import {
  type OrganizationLookupRow,
  organizationLookupSelect,
} from "../workspace/workspace-lookup.service.js";
import { TEAM_ORGANIZATION_UNIT_TYPE } from "./team.constants.js";

export type TeamLookupRow = OrganizationLookupRow;

function toTeamLookupRow(
  row:
    | {
        readonly id: string;
        readonly enterpriseId: string | null;
        readonly tenantId: string;
        readonly companyId: string;
        readonly companyEnterpriseId: string | null;
        readonly slug: string;
        readonly name: string;
        readonly type: string;
        readonly parentOrganizationId: string | null;
        readonly status: OrganizationLookupRow["status"];
        readonly effectiveFrom: string | null;
        readonly effectiveTo: string | null;
      }
    | undefined
): TeamLookupRow | null {
  if (!row || row.enterpriseId === null || row.companyEnterpriseId === null) {
    return null;
  }

  return {
    ...row,
    enterpriseId: row.enterpriseId,
    companyEnterpriseId: row.companyEnterpriseId,
  };
}

export async function findTeamById(
  teamId: string,
  db: AfendaDatabase = getDb()
): Promise<TeamLookupRow | null> {
  const [row] = await db
    .select(organizationLookupSelect)
    .from(organizations)
    .innerJoin(companies, eq(organizations.companyId, companies.id))
    .where(
      and(
        eq(organizations.id, teamId),
        eq(organizations.type, TEAM_ORGANIZATION_UNIT_TYPE)
      )
    )
    .limit(1);

  return toTeamLookupRow(row);
}

export async function findTeamByCompanyAndSlug(
  companyId: string,
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<TeamLookupRow | null> {
  const [row] = await db
    .select(organizationLookupSelect)
    .from(organizations)
    .innerJoin(companies, eq(organizations.companyId, companies.id))
    .where(
      and(
        eq(organizations.companyId, companyId),
        eq(organizations.slug, slug),
        eq(organizations.type, TEAM_ORGANIZATION_UNIT_TYPE)
      )
    )
    .limit(1);

  return toTeamLookupRow(row);
}

export function isTeamOrganizationRow(
  row: Pick<OrganizationLookupRow, "type">
): boolean {
  return row.type === TEAM_ORGANIZATION_UNIT_TYPE;
}
