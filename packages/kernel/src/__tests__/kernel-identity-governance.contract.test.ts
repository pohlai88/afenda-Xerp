import { describe, expect, it } from "vitest";

import {
  ENTERPRISE_ID_FAMILIES,
  ENTERPRISE_ID_TYPE_NAMES,
  getIdentityProhibitedPattern,
  getKernelIdentityGovernanceGate,
  IDENTITY_GOVERNANCE_AUTHORITY,
  IDENTITY_PROHIBITED_PATTERNS,
  IDENTITY_PROMOTION_REQUIREMENT_IDS,
  IDENTITY_PROMOTION_REQUIREMENTS,
  isForbiddenPlatformFloorIdSymbol,
  isIdentityProhibitedPatternId,
  isKernelIdentityGovernanceGateId,
  KERNEL_IDENTITY_GOVERNANCE_BUNDLE,
  KERNEL_IDENTITY_GOVERNANCE_GATE_SCRIPTS,
  KERNEL_IDENTITY_GOVERNANCE_GATES,
  listIdentityProhibitedPatternsWithGate,
} from "../identity/index.js";

describe("identity governance contracts (PAS-001 §4.1 / Slice E)", () => {
  it("records governance bundle and gate manifest", () => {
    expect(KERNEL_IDENTITY_GOVERNANCE_BUNDLE).toBe(
      "check:kernel-identity-governance"
    );
    expect(KERNEL_IDENTITY_GOVERNANCE_GATES).toHaveLength(12);
    expect(new Set(KERNEL_IDENTITY_GOVERNANCE_GATE_SCRIPTS).size).toBe(12);
    expect(isKernelIdentityGovernanceGateId("identity-boundary")).toBe(true);
    expect(getKernelIdentityGovernanceGate("identity-boundary").script).toBe(
      "check:identity-boundary"
    );
  });

  it("derives enterprise ID type names from registry", () => {
    expect(ENTERPRISE_ID_TYPE_NAMES).toHaveLength(
      ENTERPRISE_ID_FAMILIES.length
    );
    expect(ENTERPRISE_ID_TYPE_NAMES).toContain("TenantId");
    expect(ENTERPRISE_ID_TYPE_NAMES).not.toContain("LocaleCode");
  });

  it("records prohibited patterns with enforcement gates", () => {
    expect(isIdentityProhibitedPatternId("unchecked-enterprise-id-cast")).toBe(
      true
    );
    expect(
      getIdentityProhibitedPattern("unchecked-enterprise-id-cast")
        .enforcementGate
    ).toBe("check:identity-boundary");
    expect(
      listIdentityProhibitedPatternsWithGate("check:identity-boundary").map(
        (entry) => entry.id
      )
    ).toContain("unchecked-enterprise-id-cast");
  });

  it("records promotion checklist requirements", () => {
    expect(IDENTITY_PROMOTION_REQUIREMENT_IDS).toHaveLength(13);
    expect(IDENTITY_PROMOTION_REQUIREMENTS["registry-row"].evidenceGate).toBe(
      "check:kernel-identity-surface"
    );
  });

  it("tracks forbidden fiscal platform-floor symbols", () => {
    expect(isForbiddenPlatformFloorIdSymbol("FiscalCalendarId")).toBe(true);
    expect(isForbiddenPlatformFloorIdSymbol("TenantId")).toBe(false);
    expect(
      IDENTITY_PROHIBITED_PATTERNS["forbidden-platform-floor-id-export"]
        .authority
    ).toBe("PAS-001");
  });

  it("anchors governance authority metadata", () => {
    expect(IDENTITY_GOVERNANCE_AUTHORITY).toEqual({
      pas: "PAS-001",
      section: "4.1",
      adr: "ADR-0021",
    });
  });
});
