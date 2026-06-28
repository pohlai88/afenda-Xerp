import { describe, expect, it } from "vitest";
import { parseProductId, parseTenantId } from "../../families/index.js";
import {
  parseCanonicalId,
  parseRegisteredCanonicalEnterpriseId,
  tryParseCanonicalId,
  tryParseRegisteredCanonicalEnterpriseId,
} from "../canonical-id-parser.contract.js";
import {
  isCanonicalEnterpriseId,
  isCanonicalEnterpriseIdForFamily,
  isRegisteredCanonicalEnterpriseId,
} from "../canonical-id-validator.contract.js";
import { InvalidCanonicalIdError } from "../invalid-canonical-id.error.js";

const VALID_TENANT = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV";
const VALID_PRODUCT = "prd_01ARZ3NDEKTSV4RRFFQ69G5FBV";
const WRONG_FAMILY_PRODUCT = "cus_01ARZ3NDEKTSV4RRFFQ69G5FCV";
const UNREGISTERED_PREFIX = "abc_01ARZ3NDEKTSV4RRFFQ69G5FAV";

describe("canonical-id-parser.contract (PAS-001 §4.1.3 / Action 4)", () => {
  describe("Action 4 — validation order: empty → format → registry → family prefix", () => {
    it("accepts valid tenant and product ids at family parsers", () => {
      expect(parseTenantId(VALID_TENANT)).toBe(VALID_TENANT);
      expect(parseProductId(VALID_PRODUCT)).toBe(VALID_PRODUCT);
    });

    it("rejects wrong family prefix after format and registry checks", () => {
      expect(() => parseProductId(WRONG_FAMILY_PRODUCT)).toThrow(
        /ProductId must start with prd_\./
      );
    });

    it("rejects unregistered wire prefix before family prefix check", () => {
      expect(() => parseCanonicalId(UNREGISTERED_PREFIX, "tenant")).toThrow(
        /prefix is not registered in ID_FAMILIES\./
      );
      expect(() => parseProductId(UNREGISTERED_PREFIX)).toThrow(
        /prefix is not registered in ID_FAMILIES\./
      );
    });

    it("validates empty before format", () => {
      expect(() => parseCanonicalId("", "tenant")).toThrow(
        /TenantId is required\./
      );
    });

    it("validates format before registry and family prefix", () => {
      expect(() => parseTenantId("ten_invalid")).toThrow(
        /TenantId has invalid canonical ID format\./
      );
    });
  });

  it("rejects whitespace-padded wire values without silent trim", () => {
    expect(() => parseCanonicalId(`  ${VALID_PRODUCT}  `, "product")).toThrow(
      /ProductId has invalid canonical ID format\./
    );
    expect(isCanonicalEnterpriseId(`  ${VALID_PRODUCT}  `)).toBe(false);
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

  it("rejects wrong registry prefix at family-prefix tier (step 4)", () => {
    expect(() => parseCanonicalId(WRONG_FAMILY_PRODUCT, "product")).toThrow(
      /ProductId must start with prd_\./
    );
    expect(tryParseCanonicalId(WRONG_FAMILY_PRODUCT, "product")).toBeNull();
  });

  it("rejects unregistered prefix at registry tier (step 3)", () => {
    expect(isCanonicalEnterpriseId(UNREGISTERED_PREFIX)).toBe(true);
    expect(isRegisteredCanonicalEnterpriseId(UNREGISTERED_PREFIX)).toBe(false);
    expect(
      isCanonicalEnterpriseIdForFamily(UNREGISTERED_PREFIX, "product")
    ).toBe(false);
    expect(() => parseCanonicalId(UNREGISTERED_PREFIX, "product")).toThrow(
      /prefix is not registered in ID_FAMILIES\./
    );
    expect(tryParseCanonicalId(UNREGISTERED_PREFIX, "product")).toBeNull();
    expect(() =>
      parseRegisteredCanonicalEnterpriseId(UNREGISTERED_PREFIX)
    ).toThrow(InvalidCanonicalIdError);
    expect(
      tryParseRegisteredCanonicalEnterpriseId(UNREGISTERED_PREFIX)
    ).toBeNull();
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
