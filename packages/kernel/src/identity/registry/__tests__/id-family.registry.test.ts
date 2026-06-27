import { describe, expect, it } from "vitest";
import { InvalidCanonicalIdError } from "../../canonical/invalid-canonical-id.error.js";
import { parseProductId } from "../../families/index.js";
import {
  isRegisteredEnterpriseIdPrefix,
  REGISTERED_ENTERPRISE_ID_PREFIXES,
} from "../enterprise-id-prefix.registry.js";
import {
  ENTERPRISE_ID_FAMILIES,
  ENTERPRISE_ID_FAMILY_KEYS,
  ENTERPRISE_ID_FAMILY_PREFIX_AUTHORITY,
  ID_FAMILIES,
  ID_FAMILY_COUNT,
} from "../id-family.registry.js";

const VALID_PRODUCT = "prd_01ARZ3NDEKTSV4RRFFQ69G5FBV";
const WRONG_PREFIX_FOR_PRODUCT = "cus_01ARZ3NDEKTSV4RRFFQ69G5FCV";

describe("ID_FAMILIES", () => {
  it("contains exactly 22 enterprise ID families", () => {
    expect(ID_FAMILY_COUNT).toBe(22);
    expect(ENTERPRISE_ID_FAMILIES).toHaveLength(ID_FAMILY_COUNT);
    expect(ENTERPRISE_ID_FAMILY_KEYS).toHaveLength(ID_FAMILY_COUNT);
  });

  it("uses unique prefixes", () => {
    const prefixes = ENTERPRISE_ID_FAMILIES.map(
      (familyKey) => ID_FAMILIES[familyKey].prefix
    );
    expect(new Set(prefixes).size).toBe(prefixes.length);
  });

  it("uses exactly three lowercase letters for every enterprise prefix", () => {
    for (const familyKey of ENTERPRISE_ID_FAMILIES) {
      expect(ID_FAMILIES[familyKey].prefix).toMatch(/^[a-z]{3}$/);
    }
  });

  it("uses kernel as owner for every enterprise family", () => {
    for (const familyKey of ENTERPRISE_ID_FAMILIES) {
      expect(ID_FAMILIES[familyKey].owner).toBe("kernel");
    }
  });

  it("does not register unknown prefixes", () => {
    const prefixes = REGISTERED_ENTERPRISE_ID_PREFIXES;
    expect(prefixes).not.toContain("abc");
    expect(isRegisteredEnterpriseIdPrefix("abc")).toBe(false);
  });

  it("accepts correct prefix at family parser", () => {
    expect(parseProductId(VALID_PRODUCT)).toBe(VALID_PRODUCT);
  });

  it("rejects wrong prefix at family parser", () => {
    expect(() => parseProductId(WRONG_PREFIX_FOR_PRODUCT)).toThrow(
      InvalidCanonicalIdError
    );
    expect(() => parseProductId(WRONG_PREFIX_FOR_PRODUCT)).toThrow(
      /ProductId must start with prd_\./
    );
  });
});

describe("ID_FAMILIES (PAS-001 §4.1.4 / Slice B3 hardening)", () => {
  it("locks the PAS-001 §4.1.4 prefix authority table", () => {
    for (const familyKey of ENTERPRISE_ID_FAMILY_KEYS) {
      expect(ID_FAMILIES[familyKey].prefix).toBe(
        ENTERPRISE_ID_FAMILY_PREFIX_AUTHORITY[familyKey]
      );
    }
  });

  it("registers every frozen prefix for lookup", () => {
    for (const prefix of REGISTERED_ENTERPRISE_ID_PREFIXES) {
      expect(isRegisteredEnterpriseIdPrefix(prefix)).toBe(true);
    }
  });
});
