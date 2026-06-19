import { describe, expect, it } from "vitest";
import { evaluateCapability } from "../evaluation/capability-evaluation";
import {
  basicTierFixture,
  betaTierFixture,
  buildContext,
  disabledStateFixture,
  enterpriseTierFixture,
  proTierFixture,
} from "../fixtures/tier-fixtures";

const EVAL_AT = "2026-06-20T00:00:00.000Z";
let corrId = 0;
const nextCorr = () => `corr_${++corrId}`;

// ---------------------------------------------------------------------------
// Basic tier
// ---------------------------------------------------------------------------

describe("Basic tier", () => {
  const ctx = buildContext("tenant_basic", "company_basic", "accounting");

  it("allows accounting module access", () => {
    const result = evaluateCapability({
      capabilityKey: "accounting",
      context: ctx,
      entitlements: basicTierFixture.entitlements,
      featureFlags: basicTierFixture.featureFlags,
      usageLimits: basicTierFixture.usageLimits,
      betaFlags: basicTierFixture.betaFlags,
      killSwitches: basicTierFixture.killSwitches,
      localizations: basicTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("allow");
  });

  it("denies MRP module access (not entitled)", () => {
    const result = evaluateCapability({
      capabilityKey: "mrp",
      context: buildContext("tenant_basic", "company_basic", "mrp"),
      entitlements: basicTierFixture.entitlements,
      featureFlags: basicTierFixture.featureFlags,
      usageLimits: basicTierFixture.usageLimits,
      betaFlags: basicTierFixture.betaFlags,
      killSwitches: basicTierFixture.killSwitches,
      localizations: basicTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("not_entitled");
    expect(result.audit).not.toBeNull();
  });

  it("denies AI Copilot (not entitled)", () => {
    const result = evaluateCapability({
      capabilityKey: "aiCopilot",
      context: buildContext("tenant_basic", "company_basic", "aiCopilot"),
      entitlements: basicTierFixture.entitlements,
      featureFlags: basicTierFixture.featureFlags,
      usageLimits: basicTierFixture.usageLimits,
      betaFlags: basicTierFixture.betaFlags,
      killSwitches: basicTierFixture.killSwitches,
      localizations: basicTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("not_entitled");
  });

  it("denies e-Invoice (not entitled)", () => {
    const result = evaluateCapability({
      capabilityKey: "eInvoice",
      context: buildContext("tenant_basic", "company_basic", "eInvoice"),
      entitlements: basicTierFixture.entitlements,
      featureFlags: basicTierFixture.featureFlags,
      usageLimits: basicTierFixture.usageLimits,
      betaFlags: basicTierFixture.betaFlags,
      killSwitches: basicTierFixture.killSwitches,
      localizations: basicTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("not_entitled");
  });
});

// ---------------------------------------------------------------------------
// Pro tier
// ---------------------------------------------------------------------------

describe("Pro tier", () => {
  const ctx = buildContext("tenant_pro", "company_pro", "eInvoice", {
    localization: "vn",
  });

  it("allows e-Invoice on production", () => {
    const result = evaluateCapability({
      capabilityKey: "eInvoice",
      context: ctx,
      entitlements: proTierFixture.entitlements,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: proTierFixture.usageLimits,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: proTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("allow");
  });

  it("allows lot tracking", () => {
    const result = evaluateCapability({
      capabilityKey: "lotTracking",
      context: buildContext("tenant_pro", "company_pro", "lotTracking"),
      entitlements: proTierFixture.entitlements,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: proTierFixture.usageLimits,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: proTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("allow");
  });

  it("denies AI Copilot (not entitled on pro)", () => {
    const result = evaluateCapability({
      capabilityKey: "aiCopilot",
      context: buildContext("tenant_pro", "company_pro", "aiCopilot"),
      entitlements: proTierFixture.entitlements,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: proTierFixture.usageLimits,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: proTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("not_entitled");
  });

  it("denies Malaysia localization (not entitled)", () => {
    const result = evaluateCapability({
      capabilityKey: "malaysiaLocalization",
      context: buildContext(
        "tenant_pro",
        "company_pro",
        "malaysiaLocalization"
      ),
      entitlements: proTierFixture.entitlements,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: proTierFixture.usageLimits,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: proTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("not_entitled");
  });

  it("allows Vietnam localization", () => {
    const result = evaluateCapability({
      capabilityKey: "vietnamLocalization",
      context: buildContext(
        "tenant_pro",
        "company_pro",
        "vietnamLocalization",
        { localization: "vn" }
      ),
      entitlements: proTierFixture.entitlements,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: proTierFixture.usageLimits,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: proTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("allow");
  });
});

// ---------------------------------------------------------------------------
// Enterprise tier
// ---------------------------------------------------------------------------

describe("Enterprise tier", () => {
  it("allows all core modules", () => {
    for (const capability of [
      "accounting",
      "mrp",
      "lotTracking",
      "auditExport",
      "sso",
      "prioritySupport",
      "selfHostedDeployment",
    ]) {
      const result = evaluateCapability({
        capabilityKey: capability,
        context: buildContext(
          "tenant_enterprise",
          "company_enterprise",
          capability
        ),
        entitlements: enterpriseTierFixture.entitlements,
        featureFlags: enterpriseTierFixture.featureFlags,
        usageLimits: enterpriseTierFixture.usageLimits,
        betaFlags: enterpriseTierFixture.betaFlags,
        killSwitches: enterpriseTierFixture.killSwitches,
        localizations: enterpriseTierFixture.localizations,
        evaluatedAt: EVAL_AT,
        correlationId: nextCorr(),
      });

      expect(result.result, `capability=${capability}`).toBe("allow");
    }
  });

  it("allows Vietnam and Malaysia localization", () => {
    for (const [capability, locale] of [
      ["vietnamLocalization", "vn"],
      ["malaysiaLocalization", "my"],
    ] as const) {
      const result = evaluateCapability({
        capabilityKey: capability,
        context: buildContext(
          "tenant_enterprise",
          "company_enterprise",
          capability,
          { localization: locale }
        ),
        entitlements: enterpriseTierFixture.entitlements,
        featureFlags: enterpriseTierFixture.featureFlags,
        usageLimits: enterpriseTierFixture.usageLimits,
        betaFlags: enterpriseTierFixture.betaFlags,
        killSwitches: enterpriseTierFixture.killSwitches,
        localizations: enterpriseTierFixture.localizations,
        evaluatedAt: EVAL_AT,
        correlationId: nextCorr(),
      });

      expect(result.result, `capability=${capability}`).toBe("allow");
    }
  });

  it("denies AI Recommendations (beta-only, no beta flag on context)", () => {
    const result = evaluateCapability({
      capabilityKey: "aiRecommendations",
      context: buildContext(
        "tenant_enterprise",
        "company_enterprise",
        "aiRecommendations"
      ),
      entitlements: enterpriseTierFixture.entitlements,
      featureFlags: enterpriseTierFixture.featureFlags,
      usageLimits: enterpriseTierFixture.usageLimits,
      betaFlags: enterpriseTierFixture.betaFlags,
      killSwitches: enterpriseTierFixture.killSwitches,
      localizations: enterpriseTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("not_entitled");
  });

  it("denies accounting when company context does not match tenant scope", () => {
    const result = evaluateCapability({
      capabilityKey: "accounting",
      context: buildContext("tenant_other", "company_other", "accounting"),
      entitlements: enterpriseTierFixture.entitlements,
      featureFlags: enterpriseTierFixture.featureFlags,
      usageLimits: enterpriseTierFixture.usageLimits,
      betaFlags: enterpriseTierFixture.betaFlags,
      killSwitches: enterpriseTierFixture.killSwitches,
      localizations: enterpriseTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("not_entitled");
  });

  it("returns structured audit evidence on denial", () => {
    const result = evaluateCapability({
      capabilityKey: "accounting",
      context: buildContext("wrong_tenant", "company_enterprise", "accounting"),
      entitlements: enterpriseTierFixture.entitlements,
      featureFlags: enterpriseTierFixture.featureFlags,
      usageLimits: enterpriseTierFixture.usageLimits,
      betaFlags: enterpriseTierFixture.betaFlags,
      killSwitches: enterpriseTierFixture.killSwitches,
      localizations: enterpriseTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: "corr_audit_enterprise",
    });

    expect(result.result).toBe("not_entitled");
    expect(result.audit).toMatchObject({
      result: "not_entitled",
      correlationId: "corr_audit_enterprise",
      evaluatedAt: EVAL_AT,
    });
    expect(Array.isArray(result.audit?.evidence)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Beta tier
// ---------------------------------------------------------------------------

describe("Beta tier", () => {
  it("allows AI Recommendations for allowlisted tenant with beta context flag", () => {
    const result = evaluateCapability({
      capabilityKey: "aiRecommendations",
      context: buildContext(
        "tenant_beta",
        "company_beta",
        "aiRecommendations",
        {
          betaFlags: ["ai_recommendations"],
        }
      ),
      entitlements: betaTierFixture.entitlements,
      featureFlags: betaTierFixture.featureFlags,
      usageLimits: betaTierFixture.usageLimits,
      betaFlags: betaTierFixture.betaFlags,
      killSwitches: betaTierFixture.killSwitches,
      localizations: betaTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("allow");
  });

  it("blocks non-allowlisted tenant at feature flag layer (disabled before beta check)", () => {
    // The feature flag for ai_recommendations restricts to tenantAllowlist:["tenant_beta"].
    // A tenant not on that list is denied at the flag layer before beta evaluation.
    const result = evaluateCapability({
      capabilityKey: "aiRecommendations",
      context: buildContext(
        "tenant_non_beta",
        "company_non_beta",
        "aiRecommendations",
        { betaFlags: ["ai_recommendations"] }
      ),
      entitlements: betaTierFixture.entitlements,
      featureFlags: betaTierFixture.featureFlags,
      usageLimits: betaTierFixture.usageLimits,
      betaFlags: betaTierFixture.betaFlags,
      killSwitches: betaTierFixture.killSwitches,
      localizations: betaTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("disabled");
  });

  it("returns beta_required when entitlement is present, feature flag is open, but beta allowlist excludes tenant and context has no flag", () => {
    // To exercise the beta_required path we need:
    //  1. Feature flag with no tenant restriction (tenantAllowlist: [])
    //  2. Entitlement present for this tenant
    //  3. BetaFlag that excludes this tenant (not in allowlist, no context flag)
    const openFeatureFlag = {
      key: "ai_recommendations",
      enabled: true,
      rollout: "beta" as const,
      environments: ["production" as const],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "beta.ai_recommendations.kill_switch",
      metadata: {},
    };
    const restrictiveBetaFlag = {
      key: "ai_recommendations",
      enabled: true,
      tenantAllowlist: ["tenant_different_only"],
      companyAllowlist: [],
      startsAt: null,
      endsAt: null,
      metadata: {},
    };

    const result = evaluateCapability({
      capabilityKey: "aiRecommendations",
      context: buildContext("tenant_beta", "company_beta", "aiRecommendations"),
      entitlements: betaTierFixture.entitlements,
      featureFlags: [openFeatureFlag, ...enterpriseTierFixture.featureFlags],
      usageLimits: betaTierFixture.usageLimits,
      betaFlags: [restrictiveBetaFlag],
      killSwitches: betaTierFixture.killSwitches,
      localizations: betaTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("beta_required");
  });
});

// ---------------------------------------------------------------------------
// Disabled-state / kill-switch scenarios
// ---------------------------------------------------------------------------

describe("Disabled state — kill switches active", () => {
  it("blocks accounting when kill switch is armed regardless of entitlements", () => {
    const result = evaluateCapability({
      capabilityKey: "accounting",
      context: buildContext(
        "tenant_enterprise",
        "company_enterprise",
        "accounting"
      ),
      entitlements: enterpriseTierFixture.entitlements,
      featureFlags: enterpriseTierFixture.featureFlags,
      usageLimits: enterpriseTierFixture.usageLimits,
      betaFlags: enterpriseTierFixture.betaFlags,
      killSwitches: disabledStateFixture.killSwitches,
      localizations: enterpriseTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("kill_switch_active");
  });

  it("blocks AI Copilot when kill switch is armed", () => {
    const result = evaluateCapability({
      capabilityKey: "aiCopilot",
      context: buildContext(
        "tenant_enterprise",
        "company_enterprise",
        "aiCopilot",
        { betaFlags: ["ai_recommendations"] }
      ),
      entitlements: enterpriseTierFixture.entitlements,
      featureFlags: enterpriseTierFixture.featureFlags,
      usageLimits: enterpriseTierFixture.usageLimits,
      betaFlags: betaTierFixture.betaFlags,
      killSwitches: disabledStateFixture.killSwitches,
      localizations: enterpriseTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("kill_switch_active");
  });

  it("includes audit record with kill switch key on denial", () => {
    const result = evaluateCapability({
      capabilityKey: "accounting",
      context: buildContext(
        "tenant_enterprise",
        "company_enterprise",
        "accounting"
      ),
      entitlements: enterpriseTierFixture.entitlements,
      featureFlags: enterpriseTierFixture.featureFlags,
      usageLimits: enterpriseTierFixture.usageLimits,
      betaFlags: enterpriseTierFixture.betaFlags,
      killSwitches: disabledStateFixture.killSwitches,
      localizations: enterpriseTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: "corr_ks_audit",
    });

    expect(result.audit).toMatchObject({
      result: "kill_switch_active",
      correlationId: "corr_ks_audit",
    });
    expect(result.audit?.evidence[0]?.key).toBe(
      "module.accounting.kill_switch"
    );
  });
});

// ---------------------------------------------------------------------------
// Usage-limit scenarios
// ---------------------------------------------------------------------------

describe("Usage limit enforcement", () => {
  it("denies e-Invoice when monthly volume is exhausted", () => {
    const exhaustedLimits = proTierFixture.usageLimits.map((l) =>
      l.key === "einvoice.volume.monthly" ? { ...l, used: l.maximum } : l
    );

    const result = evaluateCapability({
      capabilityKey: "eInvoice",
      context: buildContext("tenant_pro", "company_pro", "eInvoice", {
        localization: "vn",
      }),
      entitlements: proTierFixture.entitlements,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: exhaustedLimits,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: proTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: "corr_limit_einvoice",
    });

    expect(result.result).toBe("limit_exceeded");
    expect(result.audit?.evidence[0]).toMatchObject({
      key: "einvoice.volume.monthly",
      expected: 500,
      actual: 500,
    });
  });

  it("denies AI Copilot with limit_exceeded when token limit is at maximum and beta context flag present", () => {
    // aiCopilot evaluates: kill_switch → feature_flag → entitlement → beta_flag → limit
    // With context.betaFlags=["ai_recommendations"], beta check passes via contextFlagEnabled.
    // The exhausted limit is then the terminal denial reason.
    const exhaustedLimits = enterpriseTierFixture.usageLimits.map((l) =>
      l.key === "ai.tokens.monthly" ? { ...l, used: l.maximum } : l
    );

    const result = evaluateCapability({
      capabilityKey: "aiCopilot",
      context: buildContext(
        "tenant_enterprise",
        "company_enterprise",
        "aiCopilot",
        { betaFlags: ["ai_recommendations"] }
      ),
      entitlements: enterpriseTierFixture.entitlements,
      featureFlags: enterpriseTierFixture.featureFlags,
      usageLimits: exhaustedLimits,
      betaFlags: betaTierFixture.betaFlags,
      killSwitches: enterpriseTierFixture.killSwitches,
      localizations: enterpriseTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: "corr_limit_ai",
    });

    expect(result.result).toBe("limit_exceeded");
    expect(result.audit?.evidence[0]).toMatchObject({
      key: "ai.tokens.monthly",
    });
  });

  it("allows when used equals zero against positive maximum", () => {
    const zeroUsage = proTierFixture.usageLimits.map((l) =>
      l.key === "einvoice.volume.monthly" ? { ...l, used: 0 } : l
    );

    const result = evaluateCapability({
      capabilityKey: "eInvoice",
      context: buildContext("tenant_pro", "company_pro", "eInvoice", {
        localization: "vn",
      }),
      entitlements: proTierFixture.entitlements,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: zeroUsage,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: proTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("allow");
  });
});

// ---------------------------------------------------------------------------
// Localization-gated scenarios
// ---------------------------------------------------------------------------

describe("Localization-gated access", () => {
  it("denies e-Invoice when localization entitlement is absent (localization_required)", () => {
    const entitlementsWithoutLocalization = proTierFixture.entitlements.filter(
      (e) => e.key !== "localization.vn.enabled"
    );

    const result = evaluateCapability({
      capabilityKey: "eInvoice",
      context: buildContext("tenant_pro", "company_pro", "eInvoice", {
        localization: "vn",
      }),
      entitlements: entitlementsWithoutLocalization,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: proTierFixture.usageLimits,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: proTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: "corr_loc_required",
    });

    expect(result.result).toBe("localization_required");
    expect(result.audit).toMatchObject({
      result: "localization_required",
      correlationId: "corr_loc_required",
    });
  });

  it("denies Vietnam localization when localization record is absent", () => {
    const result = evaluateCapability({
      capabilityKey: "vietnamLocalization",
      context: buildContext(
        "tenant_pro",
        "company_pro",
        "vietnamLocalization",
        { localization: "vn" }
      ),
      entitlements: proTierFixture.entitlements,
      featureFlags: proTierFixture.featureFlags,
      usageLimits: proTierFixture.usageLimits,
      betaFlags: proTierFixture.betaFlags,
      killSwitches: proTierFixture.killSwitches,
      localizations: [],
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("localization_required");
  });
});

// ---------------------------------------------------------------------------
// Audit contract integrity
// ---------------------------------------------------------------------------

describe("Audit contract integrity", () => {
  it("audit event is JSON-serializable", () => {
    const result = evaluateCapability({
      capabilityKey: "mrp",
      context: buildContext("tenant_basic", "company_basic", "mrp"),
      entitlements: basicTierFixture.entitlements,
      featureFlags: basicTierFixture.featureFlags,
      usageLimits: basicTierFixture.usageLimits,
      betaFlags: basicTierFixture.betaFlags,
      killSwitches: basicTierFixture.killSwitches,
      localizations: basicTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: "corr_json_safe",
    });

    expect(result.result).toBe("not_entitled");
    expect(() => JSON.stringify(result.audit)).not.toThrow();
    expect(JSON.parse(JSON.stringify(result.audit))).toEqual(result.audit);
  });

  it("allowed decision returns null audit", () => {
    const result = evaluateCapability({
      capabilityKey: "accounting",
      context: buildContext("tenant_basic", "company_basic", "accounting"),
      entitlements: basicTierFixture.entitlements,
      featureFlags: basicTierFixture.featureFlags,
      usageLimits: basicTierFixture.usageLimits,
      betaFlags: basicTierFixture.betaFlags,
      killSwitches: basicTierFixture.killSwitches,
      localizations: basicTierFixture.localizations,
      evaluatedAt: EVAL_AT,
      correlationId: nextCorr(),
    });

    expect(result.result).toBe("allow");
    expect(result.audit).toBeNull();
  });
});
