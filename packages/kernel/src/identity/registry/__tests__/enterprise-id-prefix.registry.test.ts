import { describe, expect, it } from "vitest";

import {
  ENTERPRISE_ID_PREFIX_TO_FAMILY,
  extractCanonicalEnterpriseIdPrefix,
  isRegisteredEnterpriseIdPrefix,
  REGISTERED_ENTERPRISE_ID_PREFIXES,
  resolveEnterpriseIdFamilyFromPrefix,
} from "../enterprise-id-prefix.registry.js";
import { ENTERPRISE_ID_FAMILIES, ID_FAMILIES } from "../id-family.registry.js";

const VALID_PRODUCT = "prd_01ARZ3NDEKTSV4RRFFQ69G5FBV";
const UNREGISTERED = "abc_01ARZ3NDEKTSV4RRFFQ69G5FAV";

describe("enterprise-id-prefix.registry (PAS-001 §4.1.4 hardening)", () => {
  it("freezes 22 prefixes derived from ID_FAMILIES", () => {
    expect(REGISTERED_ENTERPRISE_ID_PREFIXES).toHaveLength(22);
    expect(REGISTERED_ENTERPRISE_ID_PREFIXES).toEqual(
      ENTERPRISE_ID_FAMILIES.map((family) => ID_FAMILIES[family].prefix)
    );
  });

  it("maps every registered prefix back to its family key", () => {
    for (const family of ENTERPRISE_ID_FAMILIES) {
      const prefix = ID_FAMILIES[family].prefix;
      expect(ENTERPRISE_ID_PREFIX_TO_FAMILY[prefix]).toBe(family);
      expect(resolveEnterpriseIdFamilyFromPrefix(prefix)).toBe(family);
      expect(isRegisteredEnterpriseIdPrefix(prefix)).toBe(true);
    }
  });

  it("rejects unregistered prefixes", () => {
    expect(isRegisteredEnterpriseIdPrefix("abc")).toBe(false);
    expect(resolveEnterpriseIdFamilyFromPrefix("abc")).toBeNull();
  });

  it("extracts prefix from canonical id strings", () => {
    expect(extractCanonicalEnterpriseIdPrefix(VALID_PRODUCT)).toBe("prd");
    expect(extractCanonicalEnterpriseIdPrefix(`  ${VALID_PRODUCT}  `)).toBe(
      "prd"
    );
    expect(extractCanonicalEnterpriseIdPrefix(UNREGISTERED)).toBe("abc");
    expect(
      extractCanonicalEnterpriseIdPrefix("ten01ARZ3NDEKTSV4RRFFQ69G5FAV")
    ).toBeNull();
  });
});
