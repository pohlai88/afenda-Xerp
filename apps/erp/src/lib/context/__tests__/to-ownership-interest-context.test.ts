import { describe, expect, it } from "vitest";

import { toOwnershipInterestContext } from "../to-ownership-interest-context";

describe("toOwnershipInterestContext", () => {
  it("maps database authority records into kernel ownership interest context", () => {
    expect(
      toOwnershipInterestContext({
        ownershipInterestId: "oi-1",
        tenantId: "tenant-1",
        entityGroupId: "group-1",
        parentLegalEntityId: "parent-1",
        investeeLegalEntityId: "child-1",
        ownershipPercentage: 100,
        votingPercentage: 100,
        controlType: "control",
        consolidationTreatment: "full_consolidation",
        nonControllingInterestApplicable: false,
        effectiveFrom: "2026-01-01",
        effectiveTo: null,
        status: "active",
      })
    ).toEqual({
      ownershipInterestId: "oi-1",
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      parentLegalEntityId: "parent-1",
      childLegalEntityId: "child-1",
      ownershipPercentage: 100,
      votingPercentage: 100,
      controlType: "control",
      consolidationTreatment: "full_consolidation",
      nonControllingInterestApplicable: false,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      status: "active",
    });
  });
});
