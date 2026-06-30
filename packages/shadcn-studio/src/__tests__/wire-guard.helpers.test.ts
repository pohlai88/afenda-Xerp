import { describe, expect, it } from "vitest";

import {
  isBoolean,
  isNonEmptyString,
  isOptionalBoolean,
  isOptionalNonEmptyString,
  isOptionalString,
  isReadonlyArrayOf,
  isWireRecord,
} from "../contracts/wire-guard.helpers.js";

describe("wire guard helpers (PAS-006)", () => {
  it("isNonEmptyString rejects whitespace-only strings", () => {
    expect(isNonEmptyString("valid")).toBe(true);
    expect(isNonEmptyString("  padded  ")).toBe(true);
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString("   ")).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
  });

  it("isWireRecord rejects arrays and null", () => {
    expect(isWireRecord({ ok: true })).toBe(true);
    expect(isWireRecord([])).toBe(false);
    expect(isWireRecord(null)).toBe(false);
    expect(isWireRecord("string")).toBe(false);
  });

  it("optional helpers accept expected shapes", () => {
    expect(isOptionalString(undefined)).toBe(true);
    expect(isOptionalString("")).toBe(true);
    expect(isOptionalString(null)).toBe(false);

    expect(isOptionalNonEmptyString(undefined)).toBe(true);
    expect(isOptionalNonEmptyString("ref")).toBe(true);
    expect(isOptionalNonEmptyString("   ")).toBe(false);

    expect(isOptionalBoolean(undefined)).toBe(true);
    expect(isOptionalBoolean(true)).toBe(true);
    expect(isOptionalBoolean("true")).toBe(false);
    expect(isBoolean(false)).toBe(true);
  });

  it("isReadonlyArrayOf validates every element", () => {
    expect(isReadonlyArrayOf(["a", "b"], isNonEmptyString)).toBe(true);
    expect(isReadonlyArrayOf(["a", "   "], isNonEmptyString)).toBe(false);
    expect(isReadonlyArrayOf(null, isNonEmptyString)).toBe(false);
  });
});
