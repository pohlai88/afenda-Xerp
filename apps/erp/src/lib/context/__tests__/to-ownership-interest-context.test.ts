import type { OwnershipInterestAuthorityRecord } from "@afenda/database";
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

describe("toOwnershipInterestContext", () => {
  it("maps database authority records into kernel ownership interest context", () => {
    expect(
      toOwnershipInterestContext({
        ownershipInterestId: OWNERSHIP,
        tenantId: TENANT,
        entityGroupId: GROUP,
        parentLegalEntityId: PARENT,
        childLegalEntityId: CHILD,
        investeeLegalEntityId: CHILD,
        ownershipPercentage: 100,
        votingPercentage: 100,
        controlType: "control",
        consolidationTreatment: "full_consolidation",
        nonControllingInterestApplicable: false,
        effectiveFrom: "2026-01-01",
        effectiveTo: null,
        status: "active",
      })
    ).toEqual(
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

  it("falls back to deprecated investeeLegalEntityId when childLegalEntityId is absent", () => {
    const childLegacy = createTestEnterpriseId(
      "company",
      "01ARZ3NDEKTSV4RRFFQ69G5FCV"
    );

    const result = toOwnershipInterestContext({
      ownershipInterestId: createTestEnterpriseId(
        "ownershipInterest",
        "01ARZ3NDEKTSV4RRFFQ69G5FBV"
      ),
      tenantId: TENANT,
      entityGroupId: GROUP,
      parentLegalEntityId: PARENT,
      investeeLegalEntityId: childLegacy,
      ownershipPercentage: 51,
      votingPercentage: 51,
      controlType: "significant_influence",
      consolidationTreatment: "equity_method",
      nonControllingInterestApplicable: true,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      status: "active",
    } as unknown as OwnershipInterestAuthorityRecord);

    expect(result.childLegalEntityId).toBe(
      parseOwnershipInterestContext({
        ownershipInterestId: createTestEnterpriseId(
          "ownershipInterest",
          "01ARZ3NDEKTSV4RRFFQ69G5FBV"
        ),
        tenantId: TENANT,
        entityGroupId: GROUP,
        parentLegalEntityId: PARENT,
        childLegalEntityId: childLegacy,
        ownershipPercentage: 51,
        votingPercentage: 51,
        controlType: "significant_influence",
        consolidationTreatment: "equity_method",
        nonControllingInterestApplicable: true,
        effectiveFrom: "2026-01-01",
        effectiveTo: null,
        status: "active",
      }).childLegalEntityId
    );
  });
});
