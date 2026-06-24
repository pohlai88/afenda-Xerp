import { describe, expect, it } from "vitest";

import {
  ACCOUNTING_AUTHORITY_ADR,
  ACCOUNTING_AUTHORITY_FINGERPRINT,
  ACCOUNTING_PACKAGE_LIFECYCLE,
  ACCOUNTING_REGISTRY_ID,
  getPackageName,
  isAccountingPackageLifecyclePhase,
  PACKAGE_NAME,
} from "../index.js";

describe("@afenda/accounting package exports", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/accounting");
    expect(getPackageName()).toBe("@afenda/accounting");
  });

  it("declares contracts-only authority metadata", () => {
    expect(ACCOUNTING_REGISTRY_ID).toBe("PKG-R01");
    expect(ACCOUNTING_AUTHORITY_ADR).toBe("ADR-0015");
    expect(ACCOUNTING_PACKAGE_LIFECYCLE).toBe("contracts-only");
    expect(ACCOUNTING_AUTHORITY_FINGERPRINT).toBe(
      "ACCOUNTING-AUTHORITY-2026-06-24-v1"
    );
  });

  it("narrows lifecycle phase strings", () => {
    expect(isAccountingPackageLifecyclePhase("contracts-only")).toBe(true);
    expect(isAccountingPackageLifecyclePhase("runtime")).toBe(true);
    expect(isAccountingPackageLifecyclePhase("posting")).toBe(false);
  });
});
