import { describe, expect, it } from "vitest";
import {
  type assertHierarchyContextJsonSerializable,
  type BrandedOwnershipInterestContext,
  brandDeriveConsolidationScopeTrustInput,
  brandOwnershipInterestContext,
  type DeriveConsolidationScopeWireInput,
  normalizeEntityGroupIdForWire,
  normalizeTenantIdForWire,
  toOwnershipInterestWireContext,
} from "../context/hierarchy-id-boundary.contract.js";
import type { OwnershipInterestContext } from "../context/ownership-interest-context.contract.js";
import {
  brandCompanyId,
  brandEntityGroupId,
  brandOwnershipInterestId,
  brandTenantId,
  toCompanyId,
  toEntityGroupId,
  toOwnershipInterestId,
  toTenantId,
} from "../contracts/platform-id.contract.js";

const SAMPLE_WIRE_INTEREST: OwnershipInterestContext = {
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
};

describe("platform-id.contract — hierarchy brands", () => {
  it("round-trips OwnershipInterestId and EntityGroupId", () => {
    const ownershipInterestId = brandOwnershipInterestId("oi-1");
    const entityGroupId = brandEntityGroupId("group-1");

    expect(ownershipInterestId).not.toBeNull();
    expect(entityGroupId).not.toBeNull();
    expect(toOwnershipInterestId(ownershipInterestId!)).toBe("oi-1");
    expect(toEntityGroupId(entityGroupId!)).toBe("group-1");
  });
});

describe("hierarchy-id-boundary.contract", () => {
  it("keeps hierarchy wire contexts JSON-serializable at compile time", () => {
    type _Guard = assertHierarchyContextJsonSerializable;
    const guard: _Guard = true;
    expect(guard).toBe(true);
  });

  it("normalizes branded ids to wire strings without changing values", () => {
    const tenantId = brandTenantId("tenant-1")!;
    const entityGroupId = brandEntityGroupId("group-1")!;

    expect(normalizeTenantIdForWire(tenantId)).toBe("tenant-1");
    expect(normalizeTenantIdForWire("tenant-1")).toBe("tenant-1");
    expect(normalizeEntityGroupIdForWire(entityGroupId)).toBe("group-1");
    expect(normalizeEntityGroupIdForWire("group-1")).toBe("group-1");
  });

  it("brands ownership interest context at trust boundaries", () => {
    const branded = brandOwnershipInterestContext(SAMPLE_WIRE_INTEREST);

    expect(toTenantId(branded.tenantId)).toBe("tenant-1");
    expect(toEntityGroupId(branded.entityGroupId)).toBe("group-1");
    expect(toOwnershipInterestId(branded.ownershipInterestId)).toBe("oi-1");
    expect(toCompanyId(branded.parentLegalEntityId)).toBe("parent-1");
    expect(toCompanyId(branded.childLegalEntityId)).toBe("child-1");
  });

  it("round-trips branded ownership interest context to wire format", () => {
    const branded: BrandedOwnershipInterestContext =
      brandOwnershipInterestContext(SAMPLE_WIRE_INTEREST);

    expect(toOwnershipInterestWireContext(branded)).toEqual(
      SAMPLE_WIRE_INTEREST
    );
  });

  it("brands consolidation scope resolver trust input", () => {
    const wireInput: DeriveConsolidationScopeWireInput = {
      tenantId: brandTenantId("tenant-1")!,
      entityGroupId: "group-1",
      reportingDate: "2026-06-01",
      ownershipInterests: [SAMPLE_WIRE_INTEREST],
    };

    const trustInput = brandDeriveConsolidationScopeTrustInput(wireInput);

    expect(toTenantId(trustInput.tenantId)).toBe("tenant-1");
    expect(toEntityGroupId(trustInput.entityGroupId)).toBe("group-1");
    expect(trustInput.ownershipInterests).toEqual([SAMPLE_WIRE_INTEREST]);
  });

  it("rejects empty tenant id at explicit trust boundary", () => {
    expect(() =>
      brandDeriveConsolidationScopeTrustInput({
        tenantId: "   ",
        entityGroupId: "group-1",
        reportingDate: "2026-06-01",
        ownershipInterests: [],
      })
    ).toThrow("tenantId is required.");
  });
});

describe("hierarchy-id-boundary.contract — branded company ids", () => {
  it("accepts branded company ids for parent and child legal entities", () => {
    const branded = brandOwnershipInterestContext({
      ...SAMPLE_WIRE_INTEREST,
      parentLegalEntityId: toCompanyId(brandCompanyId("parent-1")!),
      childLegalEntityId: toCompanyId(brandCompanyId("child-1")!),
    });

    expect(toCompanyId(branded.parentLegalEntityId)).toBe("parent-1");
    expect(toCompanyId(branded.childLegalEntityId)).toBe("child-1");
  });
});
