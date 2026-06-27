import { describe, expect, it } from "vitest";

import { buildCanonicalEnterpriseIdPatternSource } from "../../canonical/canonical-id-format.contract.js";
import {
  ENTERPRISE_ID_FAMILIES,
  ID_FAMILIES,
} from "../../registry/id-family.registry.js";
import {
  buildCanonicalEnterpriseIdCheckPattern,
  CANONICAL_ID_POSTGRES_CHECKS,
  getCanonicalIdPostgresCheckPattern,
  getPostgresCanonicalIdCheckPattern,
  POSTGRES_CANONICAL_ID_CHECK_PATTERNS,
} from "../canonical-id-check.contract.js";

describe("canonical-id-check.contract (PAS-001 §4.1.12 / Action 5)", () => {
  it("builds family-specific Postgres CHECK patterns from format authority", () => {
    expect(getCanonicalIdPostgresCheckPattern("cus")).toBe(
      "^cus_[0-9A-HJKMNP-TV-Z]{26}$"
    );
    expect(getCanonicalIdPostgresCheckPattern("ten")).toBe(
      buildCanonicalEnterpriseIdPatternSource("ten")
    );
  });

  it("freezes CHECK expectations for all enterprise ID families", () => {
    expect(Object.keys(CANONICAL_ID_POSTGRES_CHECKS)).toHaveLength(22);
    expect(ENTERPRISE_ID_FAMILIES).toHaveLength(22);

    for (const family of ENTERPRISE_ID_FAMILIES) {
      const prefix = ID_FAMILIES[family].prefix;
      expect(CANONICAL_ID_POSTGRES_CHECKS[family]).toBe(
        getCanonicalIdPostgresCheckPattern(prefix)
      );
      expect(getPostgresCanonicalIdCheckPattern(family)).toBe(
        CANONICAL_ID_POSTGRES_CHECKS[family]
      );
    }
  });

  it("excludes primitive families without enterprise prefixes", () => {
    expect(CANONICAL_ID_POSTGRES_CHECKS).not.toHaveProperty("localeCode");
    expect(CANONICAL_ID_POSTGRES_CHECKS).not.toHaveProperty("currencyCode");
  });

  it("keeps structured pattern manifest aligned with frozen map", () => {
    expect(POSTGRES_CANONICAL_ID_CHECK_PATTERNS).toHaveLength(22);
    for (const entry of POSTGRES_CANONICAL_ID_CHECK_PATTERNS) {
      expect(entry.pattern).toBe(CANONICAL_ID_POSTGRES_CHECKS[entry.family]);
    }
  });

  it("preserves governance alias for database parity gate", () => {
    expect(buildCanonicalEnterpriseIdCheckPattern("prd")).toBe(
      getCanonicalIdPostgresCheckPattern("prd")
    );
  });
});
