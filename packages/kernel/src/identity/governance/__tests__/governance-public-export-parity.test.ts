import { describe, expect, it } from "vitest";

import {
  BUSINESS_REFERENCE_IDENTITY_POLICY as kernelBusinessReferencePolicy,
  getBusinessReferenceRecordOwner as kernelGetBusinessReferenceRecordOwner,
  isBusinessReferenceIdentityFamily as kernelIsBusinessReferenceIdentityFamily,
} from "../../../index.js";
import {
  BUSINESS_REFERENCE_IDENTITY_FAMILIES,
  BUSINESS_REFERENCE_IDENTITY_FAMILY_COUNT,
  BUSINESS_REFERENCE_IDENTITY_POLICY,
  BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS,
  BUSINESS_REFERENCE_RECORD_OWNERS,
  getBusinessReferenceRecordOwner,
  isBusinessReferenceIdentityFamily,
} from "../../index.js";
import {
  BUSINESS_REFERENCE_IDENTITY_POLICY as governanceBusinessReferencePolicy,
  getBusinessReferenceRecordOwner as governanceGetBusinessReferenceRecordOwner,
  isBusinessReferenceIdentityFamily as governanceIsBusinessReferenceIdentityFamily,
} from "../index.js";

describe("governance public export parity (PAS-001 §4.7 / ADR-0021)", () => {
  it("re-exports business reference identity policy from identity and @afenda/kernel root", () => {
    expect(BUSINESS_REFERENCE_IDENTITY_POLICY.kernelOwnsReferenceIdsOnly).toBe(
      true
    );
    expect(BUSINESS_REFERENCE_IDENTITY_POLICY.familyCount).toBe(
      BUSINESS_REFERENCE_IDENTITY_FAMILY_COUNT
    );
    expect(BUSINESS_REFERENCE_IDENTITY_FAMILIES).toHaveLength(7);
    expect(BUSINESS_REFERENCE_RECORD_OWNERS.product).toBe("product-inventory");
    expect(BUSINESS_REFERENCE_KERNEL_PROHIBITED_PATTERNS).toContain(
      "business lifecycle in kernel"
    );

    expect(governanceBusinessReferencePolicy).toBe(
      BUSINESS_REFERENCE_IDENTITY_POLICY
    );
    expect(kernelBusinessReferencePolicy).toBe(
      BUSINESS_REFERENCE_IDENTITY_POLICY
    );
  });

  it("re-exports business reference helpers from identity and @afenda/kernel root", () => {
    expect(isBusinessReferenceIdentityFamily("customer")).toBe(true);
    expect(isBusinessReferenceIdentityFamily("tenant")).toBe(false);
    expect(getBusinessReferenceRecordOwner("customer")).toBe("crm-sales");

    expect(governanceIsBusinessReferenceIdentityFamily).toBe(
      isBusinessReferenceIdentityFamily
    );
    expect(kernelIsBusinessReferenceIdentityFamily).toBe(
      isBusinessReferenceIdentityFamily
    );
    expect(governanceGetBusinessReferenceRecordOwner).toBe(
      getBusinessReferenceRecordOwner
    );
    expect(kernelGetBusinessReferenceRecordOwner).toBe(
      getBusinessReferenceRecordOwner
    );
  });

  it("serializes BUSINESS_REFERENCE_IDENTITY_POLICY through JSON round-trip", () => {
    const serialized = JSON.parse(
      JSON.stringify(BUSINESS_REFERENCE_IDENTITY_POLICY)
    ) as typeof BUSINESS_REFERENCE_IDENTITY_POLICY;

    expect(serialized).toEqual(BUSINESS_REFERENCE_IDENTITY_POLICY);
    expect(serialized.families).toEqual(
      BUSINESS_REFERENCE_IDENTITY_POLICY.families
    );
    expect(serialized.recordOwners).toEqual(
      BUSINESS_REFERENCE_IDENTITY_POLICY.recordOwners
    );
  });
});
