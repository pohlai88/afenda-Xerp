import { describe, expect, it } from "vitest";

import {
  assertUuidV7WireForm,
  CANONICAL_ID_POSTGRES_CHECKS,
  getCanonicalIdPostgresCheckPattern,
  getPostgresCanonicalIdCheckPattern,
  isUuidV7WireForm,
  UUID_V7_WIRE_PATTERN_SOURCE,
} from "../../../index.js";
import {
  assertUuidV7WireForm as identityAssertUuidV7WireForm,
  CANONICAL_ID_POSTGRES_CHECKS as identityCanonicalChecks,
  getCanonicalIdPostgresCheckPattern as identityGetCanonicalIdPostgresCheckPattern,
  getPostgresCanonicalIdCheckPattern as identityGetPostgresCanonicalIdCheckPattern,
  isUuidV7WireForm as identityIsUuidV7WireForm,
  UUID_V7_WIRE_PATTERN_SOURCE as identityUuidV7Source,
} from "../../index.js";
import {
  assertUuidV7WireForm as postgresAssertUuidV7WireForm,
  CANONICAL_ID_POSTGRES_CHECKS as postgresCanonicalChecks,
  getCanonicalIdPostgresCheckPattern as postgresGetCanonicalIdPostgresCheckPattern,
  getPostgresCanonicalIdCheckPattern as postgresGetPostgresCanonicalIdCheckPattern,
  isUuidV7WireForm as postgresIsUuidV7WireForm,
  UUID_V7_WIRE_PATTERN_SOURCE as postgresUuidV7Source,
} from "../index.js";

describe("postgres public export parity (PAS-001 §4.1.12 / ADR-0022)", () => {
  it("re-exports postgres CHECK contracts from identity and @afenda/kernel root", () => {
    expect(identityGetCanonicalIdPostgresCheckPattern("ten")).toBe(
      getCanonicalIdPostgresCheckPattern("ten")
    );
    expect(identityGetPostgresCanonicalIdCheckPattern("tenant")).toBe(
      getPostgresCanonicalIdCheckPattern("tenant")
    );
    expect(identityCanonicalChecks.tenant).toBe(
      CANONICAL_ID_POSTGRES_CHECKS.tenant
    );
    expect(postgresGetCanonicalIdPostgresCheckPattern).toBe(
      getCanonicalIdPostgresCheckPattern
    );
    expect(postgresGetPostgresCanonicalIdCheckPattern).toBe(
      getPostgresCanonicalIdCheckPattern
    );
    expect(postgresCanonicalChecks).toBe(CANONICAL_ID_POSTGRES_CHECKS);
  });

  it("re-exports UUID v7 wire contracts from identity and @afenda/kernel root", () => {
    const sample = "018f9f8c-9f1a-7c2b-9c20-000000000001";

    expect(identityUuidV7Source).toBe(UUID_V7_WIRE_PATTERN_SOURCE);
    expect(postgresUuidV7Source).toBe(UUID_V7_WIRE_PATTERN_SOURCE);
    expect(identityIsUuidV7WireForm(sample)).toBe(isUuidV7WireForm(sample));
    expect(identityAssertUuidV7WireForm(sample, "EntityPk")).toBe(
      assertUuidV7WireForm(sample, "EntityPk")
    );
    expect(postgresIsUuidV7WireForm).toBe(isUuidV7WireForm);
    expect(postgresAssertUuidV7WireForm).toBe(assertUuidV7WireForm);
  });
});
