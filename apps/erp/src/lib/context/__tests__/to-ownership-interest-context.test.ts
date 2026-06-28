import type { OwnershipInterestLookupRow } from "@afenda/database";
import {
  createTestEnterpriseId,
  parseOwnershipInterestContext,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { toOwnershipInterestContext } from "../to-ownership-interest-context";

const OWNERSHIP = createTestEnterpriseId("ownershipInterest");
const TENANT = createTestEnterpriseId("tenant");
const GROUP = createTestEnterpriseId("entityGroup");
const PARENT = createTestEnterpriseId("company");
const CHILD = createTestEnterpriseId("company", "01ARZ3NDEKTSV4RRFFQ69G5FBV");

const OWNERSHIP_PK = "990e8400-e29b-41d4-a716-446655440010";
const TENANT_PK = "550e8400-e29b-41d4-a716-446655440000";
const GROUP_PK = "880e8400-e29b-41d4-a716-446655440003";
const PARENT_PK = "660e8400-e29b-41d4-a716-446655440001";
const CHILD_PK = "660e8400-e29b-41d4-a716-446655440002";

function buildLookupRow(
  overrides: Partial<OwnershipInterestLookupRow> = {}
): OwnershipInterestLookupRow {
  return {
    id: OWNERSHIP_PK,
    enterpriseId: OWNERSHIP,
    tenantId: TENANT_PK,
    tenantEnterpriseId: TENANT,
    entityGroupId: GROUP_PK,
    entityGroupEnterpriseId: GROUP,
    parentLegalEntityId: PARENT_PK,
    parentLegalEntityEnterpriseId: PARENT,
    childLegalEntityId: CHILD_PK,
    childLegalEntityEnterpriseId: CHILD,
    ownershipPercentage: 100,
    votingPercentage: 100,
    controlType: "control",
    consolidationTreatment: "full_consolidation",
    nonControllingInterestApplicable: false,
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    status: "active",
    ...overrides,
  };
}

describe("toOwnershipInterestContext", () => {
  it("maps lookup enterprise IDs into kernel ownership interest context", () => {
    expect(toOwnershipInterestContext(buildLookupRow())).toEqual(
      parseOwnershipInterestContext({
        ownershipInterestId: OWNERSHIP,
        tenantId: TENANT,
        entityGroupId: GROUP,
        parentLegalEntityId: PARENT,
        childLegalEntityId: CHILD,
        ownershipPercentage: 100,
        votingPercentage: 100,
        controlType: "control",
        consolidationTreatment: "full_consolidation",
        nonControllingInterestApplicable: false,
        effectiveFrom: "2026-01-01",
        effectiveTo: null,
        status: "active",
      })
    );
  });

  it("brands enterprise IDs on kernel surface — not uuid PKs (ADR-0022 split-ID)", () => {
    const row = buildLookupRow();

    const result = toOwnershipInterestContext(row);

    expect(`${result.ownershipInterestId}`).toBe(OWNERSHIP);
    expect(`${result.ownershipInterestId}`).not.toBe(row.id);
    expect(`${result.tenantId}`).toBe(TENANT);
    expect(`${result.tenantId}`).not.toBe(row.tenantId);
    expect(`${result.entityGroupId}`).toBe(GROUP);
    expect(`${result.entityGroupId}`).not.toBe(row.entityGroupId);
    expect(`${result.parentLegalEntityId}`).toBe(PARENT);
    expect(`${result.parentLegalEntityId}`).not.toBe(row.parentLegalEntityId);
    expect(`${result.childLegalEntityId}`).toBe(CHILD);
    expect(`${result.childLegalEntityId}`).not.toBe(row.childLegalEntityId);
  });
});
