import { describe, expect, it } from "vitest";

import {
  assertUuidV7WireForm,
  isUuidV7WireForm,
  UUID_V7_WIRE_PATTERN,
  UUID_V7_WIRE_PATTERN_SOURCE,
} from "../uuid-v7-format.contract.js";

const VALID_UUID_V7 = "018f9f8c-9f1a-7c2b-9c20-000000000001";

describe("uuid v7 wire format (PAS-001 §4.1.9 / ADR-0022)", () => {
  it("accepts PostgreSQL uuid_generate_v7 wire examples", () => {
    expect(isUuidV7WireForm(VALID_UUID_V7)).toBe(true);
    expect(assertUuidV7WireForm(VALID_UUID_V7, "EntityPk")).toBe(VALID_UUID_V7);
  });

  it("accepts uppercase wire input and normalizes to lowercase", () => {
    expect(
      assertUuidV7WireForm("018F9F8C-9F1A-7C2B-9C20-000000000001", "TenantPk")
    ).toBe(VALID_UUID_V7);
  });

  it("rejects UUID v4 wire form", () => {
    expect(isUuidV7WireForm("018f9f8c-9f1a-4c2b-9c20-000000000001")).toBe(
      false
    );
  });

  it("rejects hyphenless UUID strings", () => {
    expect(isUuidV7WireForm("018f9f8c9f1a7c2b9c20000000000001")).toBe(false);
  });

  it("rejects malformed UUID strings", () => {
    expect(isUuidV7WireForm("not-a-uuid")).toBe(false);
    expect(isUuidV7WireForm("018f9f8c-9f1a-7c2b")).toBe(false);
  });

  it("throws with PascalCase label on invalid wire form", () => {
    expect(() =>
      assertUuidV7WireForm("018f9f8c-9f1a-4c2b-9c20-000000000001", "EntityPk")
    ).toThrow(/EntityPk has invalid internal entity PK format/i);
  });

  it("freezes the RFC 9562 UUID v7 pattern source", () => {
    expect(UUID_V7_WIRE_PATTERN.source).toBe(UUID_V7_WIRE_PATTERN_SOURCE);
  });
});
