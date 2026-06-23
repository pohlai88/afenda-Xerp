import { and, eq, gte, isNull, lte, or } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { legalEntityOwnership } from "../schema/legal-entity-ownership.schema.js";
import {
  type OwnershipInterestAuthorityRecord,
  toOwnershipInterestAuthorityRecord,
} from "./ownership-interest.contract.js";

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
 */
export async function findOwnershipInterestsByEntityGroup(
  input: FindOwnershipInterestsInput,
  db: AfendaDatabase = getDb()
): Promise<readonly OwnershipInterestAuthorityRecord[]> {
  const effectiveOn = normalizeEffectiveOn(input.effectiveOn);

  const rows = await db
    .select({
      id: legalEntityOwnership.id,
      tenantId: legalEntityOwnership.tenantId,
      entityGroupId: legalEntityOwnership.entityGroupId,
      parentLegalEntityId: legalEntityOwnership.parentLegalEntityId,
      childLegalEntityId: legalEntityOwnership.childLegalEntityId,
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

  return rows.map((row) => toOwnershipInterestAuthorityRecord(row));
}
