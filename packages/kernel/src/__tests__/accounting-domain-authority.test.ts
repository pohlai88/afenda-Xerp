import { describe, expect, it } from "vitest";

import {
  ACCOUNTING_AUTHORITY_ADR,
  ACCOUNTING_AUTHORITY_FINGERPRINT,
  ACCOUNTING_AUTHORITY_PAS,
  ACCOUNTING_CONTRACTS_OWNER,
  ACCOUNTING_PACKAGE_LIFECYCLE,
  ACCOUNTING_REGISTRY_ID,
  isAccountingPackageLifecyclePhase,
} from "../erp-domain/accounting/index.js";

describe("@afenda/kernel accounting-domain authority (ADR-0020)", () => {
  it("declares contracts-only authority metadata in kernel", () => {
    expect(ACCOUNTING_REGISTRY_ID).toBe("PKG-R01");
    expect(ACCOUNTING_AUTHORITY_PAS).toBe("PAS-001B");
    expect(ACCOUNTING_AUTHORITY_ADR).toBe("ADR-0020");
    expect(ACCOUNTING_PACKAGE_LIFECYCLE).toBe("contracts-only");
    expect(ACCOUNTING_CONTRACTS_OWNER).toContain("erp-domain/accounting");
    expect(ACCOUNTING_AUTHORITY_FINGERPRINT).toBe(
      "ACCOUNTING-AUTHORITY-2026-06-28-v1"
    );
  });

  it("narrows lifecycle phase strings", () => {
    expect(isAccountingPackageLifecyclePhase("contracts-only")).toBe(true);
    expect(isAccountingPackageLifecyclePhase("runtime")).toBe(true);
    expect(isAccountingPackageLifecyclePhase("posting")).toBe(false);
  });
});
