import { describe, expect, it } from "vitest";
import {
  ACCOUNTING_STANDARD_REGISTRY,
  getAccountingStandardRegistryEntry,
} from "../standards/accounting-standard.registry.js";

describe("accounting standard registry (B2)", () => {
  it("registers initial IFRS/IAS standards", () => {
    expect(
      ACCOUNTING_STANDARD_REGISTRY.map((entry) => entry.standardKey)
    ).toEqual([
      "IFRS_9",
      "IFRS_10",
      "IFRS_11",
      "IFRS_12",
      "IFRS_16",
      "IFRS_18",
      "IAS_28",
    ]);
  });

  it("resolves IFRS 16 entry with version key", () => {
    const entry = getAccountingStandardRegistryEntry("IFRS_16");
    expect(entry?.standardCode).toBe("IFRS 16");
    expect(entry?.defaultAuthorityVersionKey).toBe("IFRS_16_REQUIRED_2026");
  });
});
