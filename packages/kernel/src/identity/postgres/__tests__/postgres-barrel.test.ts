import { describe, expect, it } from "vitest";

import {
  assertUuidV7WireForm,
  buildCanonicalEnterpriseIdCheckPattern,
  CANONICAL_ID_POSTGRES_CHECKS,
  getCanonicalIdPostgresCheckPattern,
  getPostgresCanonicalIdCheckPattern,
  isUuidV7WireForm,
  POSTGRES_CANONICAL_ID_CHECK_PATTERNS,
  UUID_V7_WIRE_PATTERN,
  UUID_V7_WIRE_PATTERN_SOURCE,
} from "../index.js";

describe("postgres module barrel (PAS-001 §4.1.12)", () => {
  it("re-exports canonical CHECK contracts through the postgres index", () => {
    expect(getCanonicalIdPostgresCheckPattern("ten")).toBe(
      buildCanonicalEnterpriseIdCheckPattern("ten")
    );
    expect(getPostgresCanonicalIdCheckPattern("tenant")).toBe(
      CANONICAL_ID_POSTGRES_CHECKS.tenant
    );
    expect(POSTGRES_CANONICAL_ID_CHECK_PATTERNS).toHaveLength(22);
  });

  it("re-exports UUID v7 wire contracts through the postgres index", () => {
    expect(UUID_V7_WIRE_PATTERN.source).toBe(UUID_V7_WIRE_PATTERN_SOURCE);
    expect(isUuidV7WireForm("018f9f8c-9f1a-7c2b-9c20-000000000001")).toBe(true);
    expect(
      assertUuidV7WireForm("018f9f8c-9f1a-7c2b-9c20-000000000001", "EntityPk")
    ).toBe("018f9f8c-9f1a-7c2b-9c20-000000000001");
  });
});
