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
  createTestEnterpriseId,
  parseCompanyId,
  parseEntityGroupId,
  parseOwnershipInterestId,
  parseTenantId,
  toCompanyId,
  toEntityGroupId,
  toOwnershipInterestId,
  toTenantId,
} from "../identity/index.js";

const TENANT = createTestEnterpriseId("tenant");
const ENTITY_GROUP = createTestEnterpriseId("entityGroup");
const OWNERSHIP = createTestEnterpriseId("ownershipInterest");
const PARENT = createTestEnterpriseId("company");
const CHILD = createTestEnterpriseId("company", "01ARZ3NDEKTSV4RRFFQ69G5FBV");

const SAMPLE_WIRE_INTEREST: OwnershipInterestContext = {
  ownershipInterestId: OWNERSHIP,
  tenantId: TENANT,
  entityGroupId: ENTITY_GROUP,
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
};

describe("identity — hierarchy parse", () => {
  it("round-trips OwnershipInterestId and EntityGroupId", () => {
    const ownershipInterestId = parseOwnershipInterestId(OWNERSHIP);
    const entityGroupId = parseEntityGroupId(ENTITY_GROUP);

    expect(toOwnershipInterestId(ownershipInterestId)).toBe(OWNERSHIP);
    expect(toEntityGroupId(entityGroupId)).toBe(ENTITY_GROUP);
  });
});

describe("hierarchy-id-boundary.contract", () => {
  it("keeps hierarchy wire contexts JSON-serializable at compile time", () => {
    type _Guard = assertHierarchyContextJsonSerializable;
    const guard: _Guard = true;
    expect(guard).toBe(true);
  });

  it("normalizes branded ids to wire strings without changing values", () => {
    const tenantId = parseTenantId(TENANT);
    const entityGroupId = parseEntityGroupId(ENTITY_GROUP);

    expect(normalizeTenantIdForWire(tenantId)).toBe(TENANT);
    expect(normalizeTenantIdForWire(TENANT)).toBe(TENANT);
    expect(normalizeEntityGroupIdForWire(entityGroupId)).toBe(ENTITY_GROUP);
    expect(normalizeEntityGroupIdForWire(ENTITY_GROUP)).toBe(ENTITY_GROUP);
  });

  it("brands ownership interest context at trust boundaries", () => {
    const branded = brandOwnershipInterestContext(SAMPLE_WIRE_INTEREST);

    expect(toTenantId(branded.tenantId)).toBe(TENANT);
    expect(toEntityGroupId(branded.entityGroupId)).toBe(ENTITY_GROUP);
    expect(toOwnershipInterestId(branded.ownershipInterestId)).toBe(OWNERSHIP);
    expect(toCompanyId(branded.parentLegalEntityId)).toBe(PARENT);
    expect(toCompanyId(branded.childLegalEntityId)).toBe(CHILD);
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
      tenantId: parseTenantId(TENANT),
      entityGroupId: ENTITY_GROUP,
      reportingDate: "2026-06-01",
      ownershipInterests: [SAMPLE_WIRE_INTEREST],
    };

    const trustInput = brandDeriveConsolidationScopeTrustInput(wireInput);

    expect(toTenantId(trustInput.tenantId)).toBe(TENANT);
    expect(toEntityGroupId(trustInput.entityGroupId)).toBe(ENTITY_GROUP);
    expect(trustInput.ownershipInterests).toEqual([SAMPLE_WIRE_INTEREST]);
  });

  it("rejects invalid tenant id at explicit trust boundary", () => {
    expect(() =>
      brandDeriveConsolidationScopeTrustInput({
        tenantId: "   ",
        entityGroupId: ENTITY_GROUP,
        reportingDate: "2026-06-01",
        ownershipInterests: [],
      })
    ).toThrow();
  });
});

describe("hierarchy-id-boundary.contract — branded company ids", () => {
  it("accepts branded company ids for parent and child legal entities", () => {
    const branded = brandOwnershipInterestContext({
      ...SAMPLE_WIRE_INTEREST,
      parentLegalEntityId: toCompanyId(parseCompanyId(PARENT)),
      childLegalEntityId: toCompanyId(parseCompanyId(CHILD)),
    });

    expect(toCompanyId(branded.parentLegalEntityId)).toBe(PARENT);
    expect(toCompanyId(branded.childLegalEntityId)).toBe(CHILD);
  });
});
