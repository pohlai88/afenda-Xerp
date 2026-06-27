import { describe, expect, it } from "vitest";
import { LIVE_ENTERPRISE_ID_CHECK_REGISTRY } from "../enterprise-id-check.registry.js";
import { createEnterpriseId } from "../enterprise-id-generator.js";
import { satisfiesEnterpriseIdFormatCheck } from "../id-check-constraint.js";

const VALID_CUSTOMER = "cus_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD";

describe("enterprise_id CHECK constraints", () => {
  describe("customer family pattern", () => {
    it("accepts a valid canonical customer enterprise_id", () => {
      expect(satisfiesEnterpriseIdFormatCheck(VALID_CUSTOMER, "customer")).toBe(
        true
      );
      expect(
        satisfiesEnterpriseIdFormatCheck(
          createEnterpriseId("customer"),
          "customer"
        )
      ).toBe(true);
    });

    it("rejects wrong prefix", () => {
      expect(
        satisfiesEnterpriseIdFormatCheck(
          "prd_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD",
          "customer"
        )
      ).toBe(false);
    });

    it("rejects malformed body", () => {
      expect(
        satisfiesEnterpriseIdFormatCheck("cus_not-valid", "customer")
      ).toBe(false);
    });

    it("rejects tenant human reference as enterprise_id", () => {
      expect(satisfiesEnterpriseIdFormatCheck("EMP-000123", "employee")).toBe(
        false
      );
    });

    it("allows NULL during phased backfill", () => {
      expect(satisfiesEnterpriseIdFormatCheck(null, "customer")).toBe(true);
    });
  });

  it("registry patterns accept governed IDs for every live platform table", () => {
    for (const entry of LIVE_ENTERPRISE_ID_CHECK_REGISTRY) {
      const validId = createEnterpriseId(entry.family);
      expect(
        satisfiesEnterpriseIdFormatCheck(validId, entry.family),
        entry.tableName
      ).toBe(true);
      expect(
        new RegExp(entry.checkPattern).test(validId),
        entry.tableName
      ).toBe(true);
    }
  });

  it("registry patterns reject cross-family prefix substitution", () => {
    const productId = createEnterpriseId("product");

    for (const entry of LIVE_ENTERPRISE_ID_CHECK_REGISTRY) {
      if (entry.family === "product") {
        continue;
      }

      expect(
        satisfiesEnterpriseIdFormatCheck(productId, entry.family),
        entry.tableName
      ).toBe(false);
    }
  });
});
