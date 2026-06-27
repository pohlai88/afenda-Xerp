import { describe, expect, it } from "vitest";

import { parseTenantId } from "../../families/index.js";
import {
  isCanonicalEnterpriseId,
  isCanonicalEnterpriseIdForFamily,
  isRegisteredCanonicalEnterpriseId,
  parseCanonicalId,
  tryParseCanonicalId,
} from "../canonical-id-parser.contract.js";
import { InvalidCanonicalIdError } from "../invalid-canonical-id.error.js";

const VALID_TENANT = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV";
const VALID_CUSTOMER = "cus_01ARZ3NDEKTSV4RRFFQ69G5FAV";
const UNREGISTERED_PREFIX = "abc_01ARZ3NDEKTSV4RRFFQ69G5FAV";

describe("canonical ID validation rules (PAS-001 §4.1.8)", () => {
  it("rejects wrong family prefix at parse* boundary", () => {
    expect(() => parseCanonicalId(VALID_CUSTOMER, "tenant")).toThrow(
      InvalidCanonicalIdError
    );
    expect(() => parseTenantId(VALID_CUSTOMER)).toThrow(
      /must start with ten_\./
    );
  });

  it("rejects invalid canonical separator shapes", () => {
    expect(() => parseTenantId("ten-01ARZ3NDEKTSV4RRFFQ69G5FAV")).toThrow(
      /invalid canonical ID format/i
    );
    expect(() => parseTenantId("ten__01ARZ3NDEKTSV4RRFFQ69G5FAV")).toThrow(
      /invalid canonical ID format/i
    );
    expect(isCanonicalEnterpriseId("ten__01ARZ3NDEKTSV4RRFFQ69G5FAV")).toBe(
      false
    );
  });

  it("rejects unregistered prefix at registry tier", () => {
    expect(isCanonicalEnterpriseId(UNREGISTERED_PREFIX)).toBe(true);
    expect(isRegisteredCanonicalEnterpriseId(UNREGISTERED_PREFIX)).toBe(false);
    expect(() => parseCanonicalId(UNREGISTERED_PREFIX, "tenant")).toThrow(
      /prefix is not registered in ID_FAMILIES/i
    );
  });

  it("rejects invalid ULID body charset and length", () => {
    expect(() => parseTenantId("ten_01ARZ3NDEKTSV4RRFFQ69G5FAVI")).toThrow(
      /invalid canonical ID format/i
    );
    expect(() => parseTenantId("ten_01ARZ3NDEKTSV4RRFFQ69G5F")).toThrow(
      /invalid canonical ID format/i
    );
    expect(isCanonicalEnterpriseId("ten_01ARZ3NDEKTSV4RRFFQ69G5FAVI")).toBe(
      false
    );
  });

  it("rejects lowercase ULID body without normalization", () => {
    const lowercaseBody = "ten_01arz3ndektsv4rrffq69g5fav";
    expect(() => parseTenantId(lowercaseBody)).toThrow(
      /invalid canonical ID format/i
    );
    expect(isCanonicalEnterpriseId(lowercaseBody)).toBe(false);
  });

  it("rejects whitespace-padded wire values without silent trim", () => {
    expect(() => parseTenantId(` ${VALID_TENANT} `)).toThrow(
      /invalid canonical ID format/i
    );
    expect(isCanonicalEnterpriseId(` ${VALID_TENANT} `)).toBe(false);
  });

  it("keeps is* validators non-throwing", () => {
    expect(() =>
      isCanonicalEnterpriseIdForFamily(VALID_CUSTOMER, "tenant")
    ).not.toThrow();
    expect(isCanonicalEnterpriseIdForFamily(VALID_CUSTOMER, "tenant")).toBe(
      false
    );
    expect(tryParseCanonicalId(VALID_CUSTOMER, "tenant")).toBeNull();
  });

  it("throws InvalidCanonicalIdError from parse* on invalid input", () => {
    expect(() => parseTenantId("")).toThrow(InvalidCanonicalIdError);
    expect(() => parseTenantId("   ")).toThrow(/TenantId is required/i);
  });
});
