import { describe, expect, it } from "vitest";

import {
  isPostgresUniqueViolation,
  isPostgresUniqueViolationForConstraint,
  readPostgresConstraintName,
  rethrowPostgresUniqueViolation,
} from "../postgres-error.contract.js";

describe("postgres-error.contract", () => {
  it("detects unique violations on nested pg errors", () => {
    const pgError = {
      code: "23505",
      constraint: "products_tenant_sku_unique",
    };
    const wrapped = { cause: pgError };

    expect(isPostgresUniqueViolation(wrapped)).toBe(true);
    expect(readPostgresConstraintName(wrapped)).toBe(
      "products_tenant_sku_unique"
    );
    expect(
      isPostgresUniqueViolationForConstraint(
        wrapped,
        "products_tenant_sku_unique"
      )
    ).toBe(true);
  });

  it("maps matching constraints to domain errors", () => {
    expect(() =>
      rethrowPostgresUniqueViolation(
        { code: "23505", constraint: "products_tenant_sku_unique" },
        {
          products_tenant_sku_unique: () => new Error("sku conflict"),
        }
      )
    ).toThrow("sku conflict");
  });

  it("rethrows unrelated postgres errors", () => {
    const foreignKeyError = { code: "23503", constraint: "products_tenant_id" };

    try {
      rethrowPostgresUniqueViolation(foreignKeyError, {
        products_tenant_sku_unique: () => new Error("sku conflict"),
      });
      expect.unreachable("expected rethrow");
    } catch (error) {
      expect(error).toBe(foreignKeyError);
    }
  });
});
