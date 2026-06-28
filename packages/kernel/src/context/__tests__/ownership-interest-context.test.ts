import { describe, expect, it } from "vitest";

import { assertWireOwnershipInterestContext } from "../ownership-interest-context.assert.js";
import type { OwnershipInterestWireContext } from "../ownership-interest-context.contract.js";
import {
  normalizeOwnershipInterestContextForWire,
  parseOwnershipInterestContext,
  parseUnknownOwnershipInterestContext,
} from "../ownership-interest-context.parser.js";

const VALID_WIRE: OwnershipInterestWireContext = {
  ownershipInterestId: "own_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  parentLegalEntityId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  childLegalEntityId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FBV",
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control",
  consolidationTreatment: "full_consolidation",
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

describe("ownership interest context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parseOwnershipInterestContext(VALID_WIRE);

    expect(normalizeOwnershipInterestContextForWire(context)).toEqual(
      VALID_WIRE
    );
  });

  it("parses unknown JSON ingress via parseUnknownOwnershipInterestContext", () => {
    const context = parseUnknownOwnershipInterestContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(context.ownershipInterestId).toBe(VALID_WIRE.ownershipInterestId);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireOwnershipInterestContext(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects invalid controlType enum before branding", () => {
    expect(() =>
      parseOwnershipInterestContext({
        ...VALID_WIRE,
        controlType: "banana",
      } as unknown as OwnershipInterestWireContext)
    ).toThrow(/controlType must be one of/i);
  });

  it("rejects invalid consolidationTreatment enum before branding", () => {
    expect(() =>
      parseOwnershipInterestContext({
        ...VALID_WIRE,
        consolidationTreatment: "ghost",
      } as unknown as OwnershipInterestWireContext)
    ).toThrow(/consolidationTreatment must be one of/i);
  });

  it("rejects invalid status enum before branding", () => {
    expect(() =>
      parseOwnershipInterestContext({
        ...VALID_WIRE,
        status: "ghost",
      } as unknown as OwnershipInterestWireContext)
    ).toThrow(/status must be one of/i);
  });

  it("rejects ownership percentage outside 0–100", () => {
    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        ownershipPercentage: 101,
      })
    ).toThrow(/ownershipPercentage must be a number between 0 and 100/i);
  });

  it("rejects voting percentage outside 0–100", () => {
    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        votingPercentage: -1,
      })
    ).toThrow(/votingPercentage must be a number between 0 and 100/i);
  });

  it("rejects non-finite ownership percentage before branding", () => {
    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        ownershipPercentage: Number.NaN,
      })
    ).toThrow(/ownershipPercentage must be a number between 0 and 100/i);

    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        ownershipPercentage: Number.POSITIVE_INFINITY,
      })
    ).toThrow(/ownershipPercentage must be a number between 0 and 100/i);
  });

  it("accepts policy_review_required consolidation treatment", () => {
    const context = parseOwnershipInterestContext({
      ...VALID_WIRE,
      consolidationTreatment: "policy_review_required",
    });

    expect(context.consolidationTreatment).toBe("policy_review_required");
  });

  it("brands validated percentages on parse", () => {
    const context = parseOwnershipInterestContext(VALID_WIRE);

    expect(context.ownershipPercentage).toBe(100);
    expect(context.votingPercentage).toBe(100);
  });

  it("rejects identical parent and child legal entity ids", () => {
    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        childLegalEntityId: VALID_WIRE.parentLegalEntityId,
      })
    ).toThrow(/must be different/i);
  });

  it("rejects effectiveTo before effectiveFrom", () => {
    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        effectiveFrom: "2026-06-01",
        effectiveTo: "2026-01-01",
      })
    ).toThrow(
      /effectiveTo must be null or greater than or equal to effectiveFrom/i
    );
  });

  it("rejects invalid ownership interest id family before branding", () => {
    expect(() =>
      parseOwnershipInterestContext({
        ...VALID_WIRE,
        ownershipInterestId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/ownershipInterestId/i);
  });

  it("rejects invalid tenant id family before branding", () => {
    expect(() =>
      parseOwnershipInterestContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/tenantId/i);
  });

  it("rejects invalid entityGroupId family before branding", () => {
    expect(() =>
      parseOwnershipInterestContext({
        ...VALID_WIRE,
        entityGroupId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/entityGroupId/i);
  });

  it("rejects invalid parentLegalEntityId family before branding", () => {
    expect(() =>
      parseOwnershipInterestContext({
        ...VALID_WIRE,
        parentLegalEntityId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/parentLegalEntityId|CompanyId/i);
  });

  it("rejects invalid childLegalEntityId family before branding", () => {
    expect(() =>
      parseOwnershipInterestContext({
        ...VALID_WIRE,
        childLegalEntityId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/childLegalEntityId|CompanyId/i);
  });

  it("rejects invalid effectiveFrom format before branding", () => {
    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        effectiveFrom: "2026/01/01",
      })
    ).toThrow(/effectiveFrom must be an ISO calendar date/i);
  });

  it("rejects invalid effectiveTo format before branding", () => {
    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        effectiveTo: "2026/06/01",
      })
    ).toThrow(/effectiveTo must be an ISO calendar date/i);
  });

  it("rejects whitespace-only wire ids before branding", () => {
    expect(() =>
      assertWireOwnershipInterestContext({
        ...VALID_WIRE,
        tenantId: "   ",
      })
    ).toThrow(/tenantId is required/i);
  });
});
