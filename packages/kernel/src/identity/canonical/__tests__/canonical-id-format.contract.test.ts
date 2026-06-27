import { describe, expect, it } from "vitest";

import {
  ANY_CANONICAL_ENTERPRISE_ID_PATTERN,
  ANY_CANONICAL_ENTERPRISE_ID_REGEX,
  buildCanonicalEnterpriseIdPatternSource,
  buildCanonicalEnterpriseIdRegex,
  CANONICAL_ID_BODY_LENGTH,
  CANONICAL_ID_BODY_PATTERN,
  CANONICAL_ID_BODY_REGEX,
  CANONICAL_ID_CROCKFORD_ALPHABET,
  CANONICAL_ID_PATTERN,
  CANONICAL_ID_PATTERN_SOURCE,
  CANONICAL_ID_PREFIX_LENGTH,
  CANONICAL_ID_PREFIX_PATTERN,
  CANONICAL_ID_SEPARATOR,
} from "../canonical-id-format.contract.js";

const PAS_FIXTURES = {
  tenant: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  product: "prd_01ARZ3NDEKTSV4RRFFQ69G5FBV",
  customer: "cus_01ARZ3NDEKTSV4RRFFQ69G5FCV",
} as const;

describe("canonical-id-format.contract (PAS-001 §4.1.3)", () => {
  it("defines composable pattern constants", () => {
    expect(CANONICAL_ID_PREFIX_PATTERN).toBe("[a-z]{3}");
    expect(CANONICAL_ID_SEPARATOR).toBe("_");
    expect(CANONICAL_ID_BODY_PATTERN).toBe("[0-9A-HJKMNP-TV-Z]{26}");
    expect(CANONICAL_ID_PREFIX_LENGTH).toBe(3);
    expect(CANONICAL_ID_BODY_LENGTH).toBe(26);
    expect(CANONICAL_ID_CROCKFORD_ALPHABET).toHaveLength(32);
    expect(CANONICAL_ID_CROCKFORD_ALPHABET).not.toMatch(/[ILOU]/);
  });

  it("builds the PAS canonical validation pattern", () => {
    expect(CANONICAL_ID_PATTERN_SOURCE).toBe(
      "^[a-z]{3}_[0-9A-HJKMNP-TV-Z]{26}$"
    );
    expect(ANY_CANONICAL_ENTERPRISE_ID_PATTERN).toBe(
      CANONICAL_ID_PATTERN_SOURCE
    );
    expect(ANY_CANONICAL_ENTERPRISE_ID_REGEX).toBe(CANONICAL_ID_PATTERN);
  });

  it("accepts PAS §4.1.3 examples", () => {
    for (const value of Object.values(PAS_FIXTURES)) {
      expect(CANONICAL_ID_PATTERN.test(value)).toBe(true);
      expect(CANONICAL_ID_BODY_REGEX.test(value.slice(4))).toBe(true);
    }
  });

  it("builds family-specific patterns from registered prefixes", () => {
    expect(buildCanonicalEnterpriseIdPatternSource("prd")).toBe(
      "^prd_[0-9A-HJKMNP-TV-Z]{26}$"
    );
    expect(
      buildCanonicalEnterpriseIdRegex("prd").test(PAS_FIXTURES.product)
    ).toBe(true);
    expect(
      buildCanonicalEnterpriseIdRegex("prd").test(PAS_FIXTURES.customer)
    ).toBe(false);
  });

  it("rejects invalid prefix, separator, and body shapes", () => {
    expect(CANONICAL_ID_PATTERN.test("TEN_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      false
    );
    expect(CANONICAL_ID_PATTERN.test("ten-01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      false
    );
    expect(CANONICAL_ID_PATTERN.test("ten_01ARZ3NDEKTSV4RRFFQ69G5FAVI")).toBe(
      false
    );
    expect(CANONICAL_ID_BODY_REGEX.test("01ARZ3NDEKTSV4RRFFQ69G5FAVI")).toBe(
      false
    );
  });
});
