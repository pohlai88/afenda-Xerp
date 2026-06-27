import { describe, expect, it } from "vitest";

import { parseProductId } from "../../families/business-reference-id.contract.js";
import {
  getIdFamilyDefinition,
  ID_FAMILIES,
  ID_FAMILY_CATEGORIES,
} from "../../registry/index.js";
import {
  BUSINESS_REFERENCE_IDENTITY_FAMILIES,
  BUSINESS_REFERENCE_IDENTITY_FAMILY_COUNT,
  BUSINESS_REFERENCE_IDENTITY_POLICY,
  BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS,
  BUSINESS_REFERENCE_RECORD_OWNERS,
  getBusinessReferenceRecordOwner,
  isBusinessReferenceIdentityFamily,
} from "../business-reference-identity.policy.js";

describe("business-reference-identity.policy (PAS §4.7 / ADR-0021)", () => {
  it("registers seven business-reference families from registry category", () => {
    expect(BUSINESS_REFERENCE_IDENTITY_FAMILIES).toHaveLength(
      BUSINESS_REFERENCE_IDENTITY_FAMILY_COUNT
    );
    expect(BUSINESS_REFERENCE_IDENTITY_FAMILIES).toHaveLength(7);

    for (const family of BUSINESS_REFERENCE_IDENTITY_FAMILIES) {
      expect(ID_FAMILIES[family].category).toBe(
        ID_FAMILY_CATEGORIES.businessReference
      );
      expect(isBusinessReferenceIdentityFamily(family)).toBe(true);
    }
  });

  it("declares kernel owner for every business-reference family", () => {
    for (const family of BUSINESS_REFERENCE_IDENTITY_FAMILIES) {
      expect(getIdFamilyDefinition(family).owner).toBe("kernel");
    }
  });

  it("matches recordOwner between policy map and ID_FAMILIES", () => {
    for (const family of BUSINESS_REFERENCE_IDENTITY_FAMILIES) {
      const registryOwner = getIdFamilyDefinition(family).recordOwner;
      const policyOwner = BUSINESS_REFERENCE_RECORD_OWNERS[family];

      expect(registryOwner).toBeDefined();
      expect(policyOwner).toBe(registryOwner);
      expect(getBusinessReferenceRecordOwner(family)).toBe(registryOwner);
    }
  });

  it("lists prohibited kernel business concerns", () => {
    expect(
      BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS.length
    ).toBeGreaterThan(0);
    expect(BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS).toContain(
      "business record persistence in kernel"
    );
    expect(BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS).toContain(
      "business record CRUD in kernel"
    );
    expect(BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS).toContain(
      "business lifecycle in kernel"
    );
    expect(BUSINESS_REFERENCE_IDENTITY_POLICY.prohibitedPatterns).toEqual(
      BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS
    );
  });

  it("declares PAS §4.7 authority vocabulary", () => {
    expect(BUSINESS_REFERENCE_IDENTITY_POLICY.kernelOwnsReferenceIdsOnly).toBe(
      true
    );
    expect(
      BUSINESS_REFERENCE_IDENTITY_POLICY.recordLifecycleOwnedByDomain
    ).toBe(true);
    expect(BUSINESS_REFERENCE_IDENTITY_POLICY.preferredAuthorityName).toBe(
      "Business Reference Identity Authority"
    );
  });

  it("keeps parseProductId behavior unchanged (smoke)", () => {
    const productId = parseProductId("prd_01ARZ3NDEKTSV4RRFFQ69G5FBV");
    expect(productId).toBe("prd_01ARZ3NDEKTSV4RRFFQ69G5FBV");
  });
});
