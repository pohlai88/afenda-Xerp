import { describe, expect, it } from "vitest";
import type {
  FeatureFlagContract,
  KillSwitchContract,
} from "../flag-evaluation";
import {
  allFlagsDisabled,
  allFlagsEnabled,
  allKillSwitchesInactive,
  criticalKillSwitchesActive,
} from "../flag-fixtures";
import {
  evaluateAll,
  evaluateFlag,
  isEnabled,
  isEnabledStrict,
  PACKAGE_NAME,
} from "../index";

const PROD_CTX = {
  tenantId: "tenant_test",
  companyId: "company_test",
  environment: "production" as const,
};

const DEV_CTX = {
  tenantId: "tenant_test",
  companyId: "company_test",
  environment: "development" as const,
};

// ---------------------------------------------------------------------------
// Package identity
// ---------------------------------------------------------------------------

describe("@afenda/feature-flags", () => {
  it("exports stable package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/feature-flags");
  });
});

// ---------------------------------------------------------------------------
// evaluateFlag — allowed paths
// ---------------------------------------------------------------------------

describe("evaluateFlag — allowed", () => {
  it("allows a globally enabled flag in matching environment", () => {
    const decision = evaluateFlag(
      "e_invoice",
      allFlagsEnabled,
      allKillSwitchesInactive,
      PROD_CTX
    );

    expect(decision.allowed).toBe(true);
    if (decision.allowed) {
      expect(decision.flag.key).toBe("e_invoice");
    }
  });

  it("allows a flag with empty allowlists for any tenant", () => {
    const decision = evaluateFlag(
      "lot_tracking",
      allFlagsEnabled,
      allKillSwitchesInactive,
      { ...PROD_CTX, tenantId: "any_tenant" }
    );

    expect(decision.allowed).toBe(true);
  });

  it("allows a tenant-restricted flag when tenant is in allowlist", () => {
    const flag: FeatureFlagContract = {
      key: "tenant_only",
      enabled: true,
      rollout: "limited",
      environments: ["production"],
      tenantAllowlist: ["tenant_a", "tenant_b"],
      companyAllowlist: [],
      killSwitchKey: null,
      metadata: {},
    };

    const decision = evaluateFlag("tenant_only", [flag], [], {
      ...PROD_CTX,
      tenantId: "tenant_a",
    });

    expect(decision.allowed).toBe(true);
  });

  it("allows a company-restricted flag when company is in allowlist", () => {
    const flag: FeatureFlagContract = {
      key: "company_only",
      enabled: true,
      rollout: "limited",
      environments: ["production"],
      tenantAllowlist: [],
      companyAllowlist: ["company_vip"],
      killSwitchKey: null,
      metadata: {},
    };

    const decision = evaluateFlag("company_only", [flag], [], {
      ...PROD_CTX,
      companyId: "company_vip",
    });

    expect(decision.allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// evaluateFlag — denied paths
// ---------------------------------------------------------------------------

describe("evaluateFlag — denied", () => {
  it("returns not_found when flag key does not exist", () => {
    const decision = evaluateFlag(
      "nonexistent_flag",
      allFlagsEnabled,
      allKillSwitchesInactive,
      PROD_CTX
    );

    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe("not_found");
    }
  });

  it("returns flag_disabled when flag.enabled is false", () => {
    const decision = evaluateFlag(
      "e_invoice",
      allFlagsDisabled,
      allKillSwitchesInactive,
      PROD_CTX
    );

    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe("flag_disabled");
    }
  });

  it("returns rollout_off when rollout is off", () => {
    const flag: FeatureFlagContract = {
      key: "rollout_off_flag",
      enabled: true,
      rollout: "off",
      environments: ["production"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: null,
      metadata: {},
    };

    const decision = evaluateFlag("rollout_off_flag", [flag], [], PROD_CTX);

    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe("rollout_off");
    }
  });

  it("returns kill_switch_active when kill switch is armed", () => {
    const flag: FeatureFlagContract = {
      key: "e_invoice",
      enabled: true,
      rollout: "on",
      environments: ["production"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "feature.e_invoice.kill_switch",
      metadata: {},
    };
    const ks: KillSwitchContract = {
      key: "feature.e_invoice.kill_switch",
      active: true,
      severity: "critical",
      reason: "Incident INC-8000",
      activatedBy: "ops",
      activatedAt: "2026-06-20T00:00:00.000Z",
    };

    const decision = evaluateFlag("e_invoice", [flag], [ks], PROD_CTX);

    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe("kill_switch_active");
    }
  });

  it("returns environment_excluded when environment not listed", () => {
    const decision = evaluateFlag(
      "sso",
      allFlagsEnabled,
      allKillSwitchesInactive,
      DEV_CTX
    );

    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe("environment_excluded");
    }
  });

  it("returns tenant_excluded when tenant not in allowlist", () => {
    const flag: FeatureFlagContract = {
      key: "tenant_only",
      enabled: true,
      rollout: "limited",
      environments: ["production"],
      tenantAllowlist: ["tenant_a"],
      companyAllowlist: [],
      killSwitchKey: null,
      metadata: {},
    };

    const decision = evaluateFlag("tenant_only", [flag], [], {
      ...PROD_CTX,
      tenantId: "tenant_other",
    });

    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe("tenant_excluded");
    }
  });

  it("returns company_excluded when company not in allowlist", () => {
    const flag: FeatureFlagContract = {
      key: "company_only",
      enabled: true,
      rollout: "limited",
      environments: ["production"],
      tenantAllowlist: [],
      companyAllowlist: ["company_vip"],
      killSwitchKey: null,
      metadata: {},
    };

    const decision = evaluateFlag("company_only", [flag], [], {
      ...PROD_CTX,
      companyId: "company_other",
    });

    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe("company_excluded");
    }
  });
});

// ---------------------------------------------------------------------------
// Kill switch — active blocks all tenants
// ---------------------------------------------------------------------------

describe("Kill switch supremacy", () => {
  it("blocks all flags with critical kill switch active regardless of tenant", () => {
    const decision = evaluateFlag(
      "e_invoice",
      allFlagsEnabled,
      criticalKillSwitchesActive,
      PROD_CTX
    );

    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe("kill_switch_active");
    }
  });

  it("does not block flags whose kill switch is inactive", () => {
    const decision = evaluateFlag(
      "lot_tracking",
      allFlagsEnabled,
      criticalKillSwitchesActive,
      PROD_CTX
    );

    expect(decision.allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// isEnabled — boolean shorthand
// ---------------------------------------------------------------------------

describe("isEnabled", () => {
  it("returns true for an enabled flag in correct environment", () => {
    expect(isEnabled("e_invoice", allFlagsEnabled, PROD_CTX)).toBe(true);
  });

  it("returns false for a disabled flag", () => {
    expect(isEnabled("e_invoice", allFlagsDisabled, PROD_CTX)).toBe(false);
  });

  it("isEnabledStrict returns false for missing flags", () => {
    expect(isEnabledStrict("nonexistent", allFlagsEnabled, PROD_CTX)).toBe(
      false
    );
  });

  it("returns true when flag does not exist (fail-open default)", () => {
    expect(isEnabled("nonexistent", allFlagsEnabled, PROD_CTX)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// evaluateAll — bulk evaluation
// ---------------------------------------------------------------------------

describe("evaluateAll", () => {
  it("returns a decision for every flag in the set", () => {
    const decisions = evaluateAll(
      allFlagsEnabled,
      allKillSwitchesInactive,
      PROD_CTX
    );

    for (const flag of allFlagsEnabled) {
      expect(decisions).toHaveProperty(flag.key);
    }
  });

  it("all decisions are allowed when flags are enabled and no kill switches", () => {
    const decisions = evaluateAll(
      allFlagsEnabled.filter((f) => f.environments.includes("production")),
      allKillSwitchesInactive,
      PROD_CTX
    );

    for (const [, decision] of Object.entries(decisions)) {
      expect(decision.allowed).toBe(true);
    }
  });

  it("all decisions are denied when flags are disabled", () => {
    const decisions = evaluateAll(
      allFlagsDisabled,
      allKillSwitchesInactive,
      PROD_CTX
    );

    for (const [, decision] of Object.entries(decisions)) {
      expect(decision.allowed).toBe(false);
    }
  });

  it("returns empty record for empty flag set", () => {
    const decisions = evaluateAll([], [], PROD_CTX);
    expect(Object.keys(decisions)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Discrimination check — FlagDecision is a proper discriminated union
// ---------------------------------------------------------------------------

describe("FlagDecision discriminated union", () => {
  it("narrows to FlagAllowed when allowed is true", () => {
    const decision = evaluateFlag(
      "lot_tracking",
      allFlagsEnabled,
      allKillSwitchesInactive,
      PROD_CTX
    );

    if (decision.allowed) {
      expect(decision.flag).toBeDefined();
      expect(decision.flag.key).toBe("lot_tracking");
    } else {
      throw new Error("Expected allowed decision");
    }
  });

  it("narrows to FlagDenied with reason when allowed is false", () => {
    const decision = evaluateFlag(
      "nonexistent",
      allFlagsEnabled,
      allKillSwitchesInactive,
      PROD_CTX
    );

    if (decision.allowed) {
      throw new Error("Expected denied decision");
    }
    expect(decision.reason).toBe("not_found");
  });
});
