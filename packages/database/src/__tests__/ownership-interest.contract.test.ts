import { describe, expect, it } from "vitest";

import {
  assertDistinctLegalEntities,
  buildOwnershipInterestInsertRow,
  OwnershipInterestCycleError,
  OwnershipInterestValidationError,
  resolveInvesteeLegalEntityId,
  resolveNonControllingInterestApplicable,
  toOwnershipInterestAuthorityRecord,
} from "../ownership-interest/ownership-interest.contract.js";
import {
  consolidationMethodToTreatment,
  consolidationTreatmentToMethod,
} from "../ownership-interest/ownership-interest.consolidation-treatment.js";

describe("ownership interest consolidation treatment", () => {
  it("maps domain treatments to storage methods", () => {
    expect(consolidationTreatmentToMethod("full_consolidation")).toBe("full");
    expect(consolidationTreatmentToMethod("equity_method")).toBe("equity");
    expect(
      consolidationTreatmentToMethod("proportionate_consolidation")
    ).toBe("proportional");
    expect(consolidationTreatmentToMethod("fair_value_or_cost")).toBe("cost");
    expect(consolidationTreatmentToMethod("excluded")).toBe("none");
  });

  it("round-trips storage methods to domain treatments", () => {
    for (const method of [
      "full",
      "proportional",
      "equity",
      "cost",
      "none",
    ] as const) {
      expect(
        consolidationTreatmentToMethod(consolidationMethodToTreatment(method))
      ).toBe(method);
    }
  });
});

describe("ownership interest contract", () => {
  it("rejects parent and investee being the same legal entity", () => {
    expect(() =>
      assertDistinctLegalEntities("company-a", "company-a")
    ).toThrow(OwnershipInterestCycleError);
  });

  it("accepts investeeLegalEntityId alias", () => {
    expect(
      resolveInvesteeLegalEntityId({
        investeeLegalEntityId: "child-1",
      })
    ).toBe("child-1");
  });

  it("rejects mismatched investee and child ids", () => {
    expect(() =>
      resolveInvesteeLegalEntityId({
        childLegalEntityId: "child-a",
        investeeLegalEntityId: "child-b",
      })
    ).toThrow(OwnershipInterestValidationError);
  });

  it("derives nonControllingInterestApplicable for minority interests", () => {
    expect(
      resolveNonControllingInterestApplicable({
        relationshipType: "minority_interest",
        ownershipPercentage: 15,
      })
    ).toBe(true);
  });

  it("builds governed ownership interest rows", () => {
    const row = buildOwnershipInterestInsertRow({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      parentLegalEntityId: "parent-1",
      investeeLegalEntityId: "child-1",
      ownershipPercentage: 80,
      votingPercentage: 80,
      controlType: "control",
      relationshipType: "subsidiary",
      consolidationTreatment: "full_consolidation",
      effectiveFrom: "2026-01-01",
    });

    expect(row.ownershipPercentage).toBe("80.00");
    expect(row.consolidationMethod).toBe("full");
    expect(row.nonControllingInterestApplicable).toBe(true);
  });

  it("maps persisted rows to authority records", () => {
    const record = toOwnershipInterestAuthorityRecord({
      id: "interest-1",
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      parentLegalEntityId: "parent-1",
      childLegalEntityId: "child-1",
      ownershipPercentage: "51.00",
      votingPercentage: "51.00",
      controlType: "control",
      consolidationMethod: "full",
      nonControllingInterestApplicable: true,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
      status: "active",
    });

    expect(record.investeeLegalEntityId).toBe("child-1");
    expect(record.consolidationTreatment).toBe("full_consolidation");
    expect(record.nonControllingInterestApplicable).toBe(true);
  });

  it("rejects effectiveTo before effectiveFrom", () => {
    expect(() =>
      buildOwnershipInterestInsertRow({
        tenantId: "tenant-1",
        entityGroupId: "group-1",
        parentLegalEntityId: "parent-1",
        childLegalEntityId: "child-1",
        ownershipPercentage: 100,
        votingPercentage: 100,
        controlType: "control",
        relationshipType: "subsidiary",
        consolidationTreatment: "full_consolidation",
        effectiveFrom: "2026-06-01",
        effectiveTo: "2026-01-01",
      })
    ).toThrow(OwnershipInterestValidationError);
  });
});
