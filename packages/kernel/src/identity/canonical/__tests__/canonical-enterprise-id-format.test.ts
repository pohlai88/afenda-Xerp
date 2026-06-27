import { describe, expect, it } from "vitest";

import {
  isCanonicalEnterpriseId,
  parseCanonicalId,
} from "../canonical-id-parser.contract.js";
import { InvalidCanonicalIdError } from "../invalid-canonical-id.error.js";

const VALID_TENANT = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV";
const VALID_PRODUCT = "prd_01ARZ3NDEKTSV4RRFFQ69G5FBV";
const VALID_BODY = "01ARZ3NDEKTSV4RRFFQ69G5FAV";

describe("canonical enterprise ID format", () => {
  it("accepts valid canonical ID format", () => {
    expect(isCanonicalEnterpriseId(VALID_TENANT)).toBe(true);
  });

  it("rejects missing separator", () => {
    expect(isCanonicalEnterpriseId("ten01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      false
    );
  });

  it("rejects uppercase prefix", () => {
    expect(isCanonicalEnterpriseId("TEN_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      false
    );
  });

  it("rejects invalid ULID body characters", () => {
    expect(isCanonicalEnterpriseId("ten_01ARZ3NDEKTSV4RRFFQ69G5FAI")).toBe(
      false
    );
  });

  it("rejects wrong family prefix", () => {
    expect(() => parseCanonicalId(VALID_PRODUCT, "customer")).toThrow(
      InvalidCanonicalIdError
    );
  });

  it.each([
    "I",
    "L",
    "O",
    "U",
  ] as const)("rejects Crockford-excluded %s in ULID body", (char) => {
    const invalidBody = `${VALID_BODY.slice(0, -1)}${char}`;
    expect(isCanonicalEnterpriseId(`ten_${invalidBody}`)).toBe(false);
  });
});
