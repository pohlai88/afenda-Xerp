import { and, eq } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { organizations } from "../schema/organization.schema.js";
import {
  type OrganizationLookupRow,
  organizationLookupSelect,
} from "../workspace/workspace-lookup.service.js";
import { TEAM_ORGANIZATION_UNIT_TYPE } from "./team.constants.js";

export type TeamLookupRow = OrganizationLookupRow;

export async function findTeamById(
  teamId: string,
  db: AfendaDatabase = getDb()
): Promise<TeamLookupRow | null> {
  const [row] = await db
    .select(organizationLookupSelect)
    .from(organizations)
    .where(
      and(
        eq(organizations.id, teamId),
        eq(organizations.type, TEAM_ORGANIZATION_UNIT_TYPE)
      )
    )
    .limit(1);

  return row ?? null;
}

export async function findTeamByCompanyAndSlug(
  companyId: string,
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<TeamLookupRow | null> {
  const [row] = await db
    .select(organizationLookupSelect)
    .from(organizations)
    .where(
      and(
        eq(organizations.companyId, companyId),
        eq(organizations.slug, slug),
        eq(organizations.type, TEAM_ORGANIZATION_UNIT_TYPE)
      )
    )
    .limit(1);

  return row ?? null;
}

export function isTeamOrganizationRow(
  row: Pick<OrganizationLookupRow, "type">
): boolean {
  return row.type === TEAM_ORGANIZATION_UNIT_TYPE;
}
