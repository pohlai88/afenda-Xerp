import { describe, expect, it } from "vitest";
import {
  ACCOUNTING_STANDARD_VERSION_REGISTRY,
  getAccountingStandardVersionRef,
  IFRS_AUTHORITY_VERSION_2026,
} from "../standards/standard-version.registry.js";

describe("standard version registry (B3 · B15)", () => {
  it("anchors IFRS authority version 2026", () => {
    expect(IFRS_AUTHORITY_VERSION_2026.edition).toBe(
      "Required IFRS Accounting Standards 2026"
    );
    expect(IFRS_AUTHORITY_VERSION_2026.authorityInstrument).toBe("standard");
    expect(IFRS_AUTHORITY_VERSION_2026.bindingStrength).toBe("mandatory");
  });

  it("registers per-standard version refs with supersession metadata fields", () => {
    const ifrs16 = getAccountingStandardVersionRef("IFRS_16_REQUIRED_2026");
    expect(ifrs16?.standardCode).toBe("IFRS 16");
    expect(ifrs16?.supersededByVersionKey).toBeNull();
    expect(ifrs16?.effectiveUntil).toBeNull();
    expect(
      Object.keys(ACCOUNTING_STANDARD_VERSION_REGISTRY).length
    ).toBeGreaterThanOrEqual(8);
  });
});
