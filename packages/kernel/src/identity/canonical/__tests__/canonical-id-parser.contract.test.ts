import { describe, expect, it } from "vitest";

import {
  isCanonicalEnterpriseId,
  isCanonicalEnterpriseIdForFamily,
  isRegisteredCanonicalEnterpriseId,
  parseCanonicalId,
  parseRegisteredCanonicalEnterpriseId,
  tryParseCanonicalId,
  tryParseRegisteredCanonicalEnterpriseId,
} from "../canonical-id-parser.contract.js";
import { InvalidCanonicalIdError } from "../invalid-canonical-id.error.js";

const VALID_PRODUCT = "prd_01ARZ3NDEKTSV4RRFFQ69G5FBV";

describe("canonical-id-parser.contract (PAS-001 §4.1.3 / Action 3)", () => {
  it("trims wire input before validation", () => {
    expect(parseCanonicalId(`  ${VALID_PRODUCT}  `, "product")).toBe(
      VALID_PRODUCT
    );
    expect(isCanonicalEnterpriseId(`  ${VALID_PRODUCT}  `)).toBe(true);
  });

  it("accepts valid family-prefixed canonical ids", () => {
    expect(parseCanonicalId(VALID_PRODUCT, "product")).toBe(VALID_PRODUCT);
    expect(isCanonicalEnterpriseIdForFamily(VALID_PRODUCT, "product")).toBe(
      true
    );
  });

  it("rejects empty values with family-aware required message", () => {
    expect(() => parseCanonicalId("", "product")).toThrow(
      InvalidCanonicalIdError
    );
    expect(() => parseCanonicalId("   ", "product")).toThrow(
      /ProductId is required\./
    );
  });

  it("rejects wrong registry prefix before format check", () => {
    expect(() =>
      parseCanonicalId("cus_01ARZ3NDEKTSV4RRFFQ69G5FCV", "product")
    ).toThrow(/ProductId must start with prd_\./);
    expect(
      tryParseCanonicalId("cus_01ARZ3NDEKTSV4RRFFQ69G5FCV", "product")
    ).toBeNull();
  });

  it("rejects unregistered prefix even when generic format regex passes (PAS-001 §4.1.4)", () => {
    const unregistered = "abc_01ARZ3NDEKTSV4RRFFQ69G5FAV";
    expect(isCanonicalEnterpriseId(unregistered)).toBe(true);
    expect(isRegisteredCanonicalEnterpriseId(unregistered)).toBe(false);
    expect(isCanonicalEnterpriseIdForFamily(unregistered, "product")).toBe(
      false
    );
    expect(() => parseCanonicalId(unregistered, "product")).toThrow(
      /ProductId must start with prd_\./
    );
    expect(tryParseCanonicalId(unregistered, "product")).toBeNull();
    expect(() => parseRegisteredCanonicalEnterpriseId(unregistered)).toThrow(
      InvalidCanonicalIdError
    );
    expect(tryParseRegisteredCanonicalEnterpriseId(unregistered)).toBeNull();
  });

  it("parseRegisteredCanonicalEnterpriseId resolves family from registry prefix", () => {
    const parsed = parseRegisteredCanonicalEnterpriseId(VALID_PRODUCT);
    expect(parsed.family).toBe("product");
    expect(parsed.id).toBe(VALID_PRODUCT);
  });

  it("rejects invalid canonical body after prefix match", () => {
    expect(() => parseCanonicalId("prd_invalid", "product")).toThrow(
      /ProductId has invalid canonical ID format\./
    );
  });
});
