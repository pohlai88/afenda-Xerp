import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { entityGroups } from "../schema/entity-group.schema.js";
import { legalEntityOwnership } from "../schema/legal-entity-ownership.schema.js";
import { tenants } from "../schema/tenant.schema.js";
import {
  type OwnershipInterestLookupRow,
  toOwnershipInterestLookupRow,
} from "./ownership-interest.contract.js";

const parentLegalEntityCompany = alias(
  companies,
  "ownership_parent_legal_entity_company"
);
const childLegalEntityCompany = alias(
  companies,
  "ownership_child_legal_entity_company"
);

export interface FindOwnershipInterestsInput {
  readonly effectiveOn?: string;
  readonly entityGroupId: string;
  readonly tenantId: string;
}

function normalizeEffectiveOn(value: string | undefined): string {
  if (value === undefined || value.trim().length === 0) {
    return new Date().toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

/**
 * Loads active ownership interests for an entity group effective on a date.
 * Authority read only — no consolidation arithmetic.
 * FK filter uses uuid PKs; returned rows include enterprise IDs for kernel wire.
 */
export async function findOwnershipInterestsByEntityGroup(
  input: FindOwnershipInterestsInput,
  db: AfendaDatabase = getDb()
): Promise<readonly OwnershipInterestLookupRow[]> {
  const effectiveOn = normalizeEffectiveOn(input.effectiveOn);

  const rows = await db
    .select({
      id: legalEntityOwnership.id,
      enterpriseId: legalEntityOwnership.enterpriseId,
      tenantId: legalEntityOwnership.tenantId,
      tenantEnterpriseId: tenants.enterpriseId,
      entityGroupId: legalEntityOwnership.entityGroupId,
      entityGroupEnterpriseId: entityGroups.enterpriseId,
      parentLegalEntityId: legalEntityOwnership.parentLegalEntityId,
      parentLegalEntityEnterpriseId: parentLegalEntityCompany.enterpriseId,
      childLegalEntityId: legalEntityOwnership.childLegalEntityId,
      childLegalEntityEnterpriseId: childLegalEntityCompany.enterpriseId,
      ownershipPercentage: legalEntityOwnership.ownershipPercentage,
      votingPercentage: legalEntityOwnership.votingPercentage,
      controlType: legalEntityOwnership.controlType,
      consolidationMethod: legalEntityOwnership.consolidationMethod,
      nonControllingInterestApplicable:
        legalEntityOwnership.nonControllingInterestApplicable,
      effectiveFrom: legalEntityOwnership.effectiveFrom,
      effectiveTo: legalEntityOwnership.effectiveTo,
      status: legalEntityOwnership.status,
    })
    .from(legalEntityOwnership)
    .innerJoin(tenants, eq(legalEntityOwnership.tenantId, tenants.id))
    .innerJoin(
      entityGroups,
      eq(legalEntityOwnership.entityGroupId, entityGroups.id)
    )
    .innerJoin(
      parentLegalEntityCompany,
      eq(legalEntityOwnership.parentLegalEntityId, parentLegalEntityCompany.id)
    )
    .innerJoin(
      childLegalEntityCompany,
      eq(legalEntityOwnership.childLegalEntityId, childLegalEntityCompany.id)
    )
    .where(
      and(
        eq(legalEntityOwnership.tenantId, input.tenantId),
        eq(legalEntityOwnership.entityGroupId, input.entityGroupId),
        eq(legalEntityOwnership.status, "active"),
        lte(legalEntityOwnership.effectiveFrom, effectiveOn),
        or(
          isNull(legalEntityOwnership.effectiveTo),
          gte(legalEntityOwnership.effectiveTo, effectiveOn)
        )
      )
    );

  return rows.flatMap((row) => {
    const mapped = toOwnershipInterestLookupRow(row);
    return mapped === null ? [] : [mapped];
  });
}
