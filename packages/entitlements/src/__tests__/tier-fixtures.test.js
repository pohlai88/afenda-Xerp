"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var capability_evaluation_1 = require("../evaluation/capability-evaluation");
var tier_fixtures_1 = require("../fixtures/tier-fixtures");
var EVAL_AT = "2026-06-20T00:00:00.000Z";
var corrId = 0;
var nextCorr = function () { return "corr_".concat(++corrId); };
// ---------------------------------------------------------------------------
// Basic tier
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("Basic tier", function () {
    var ctx = (0, tier_fixtures_1.buildContext)("tenant_basic", "company_basic", "accounting");
    (0, vitest_1.it)("allows accounting module access", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "accounting",
            context: ctx,
            entitlements: tier_fixtures_1.basicTierFixture.entitlements,
            featureFlags: tier_fixtures_1.basicTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.basicTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.basicTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.basicTierFixture.killSwitches,
            localizations: tier_fixtures_1.basicTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("allow");
    });
    (0, vitest_1.it)("denies MRP module access (not entitled)", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "mrp",
            context: (0, tier_fixtures_1.buildContext)("tenant_basic", "company_basic", "mrp"),
            entitlements: tier_fixtures_1.basicTierFixture.entitlements,
            featureFlags: tier_fixtures_1.basicTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.basicTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.basicTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.basicTierFixture.killSwitches,
            localizations: tier_fixtures_1.basicTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
        (0, vitest_1.expect)(result.audit).not.toBeNull();
    });
    (0, vitest_1.it)("denies AI Copilot (not entitled)", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "aiCopilot",
            context: (0, tier_fixtures_1.buildContext)("tenant_basic", "company_basic", "aiCopilot"),
            entitlements: tier_fixtures_1.basicTierFixture.entitlements,
            featureFlags: tier_fixtures_1.basicTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.basicTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.basicTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.basicTierFixture.killSwitches,
            localizations: tier_fixtures_1.basicTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
    });
    (0, vitest_1.it)("denies e-Invoice (not entitled)", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "eInvoice",
            context: (0, tier_fixtures_1.buildContext)("tenant_basic", "company_basic", "eInvoice"),
            entitlements: tier_fixtures_1.basicTierFixture.entitlements,
            featureFlags: tier_fixtures_1.basicTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.basicTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.basicTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.basicTierFixture.killSwitches,
            localizations: tier_fixtures_1.basicTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
    });
});
// ---------------------------------------------------------------------------
// Pro tier
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("Pro tier", function () {
    var ctx = (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "eInvoice", {
        localization: "vn",
    });
    (0, vitest_1.it)("allows e-Invoice on production", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "eInvoice",
            context: ctx,
            entitlements: tier_fixtures_1.proTierFixture.entitlements,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.proTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: tier_fixtures_1.proTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("allow");
    });
    (0, vitest_1.it)("allows lot tracking", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "lotTracking",
            context: (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "lotTracking"),
            entitlements: tier_fixtures_1.proTierFixture.entitlements,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.proTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: tier_fixtures_1.proTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("allow");
    });
    (0, vitest_1.it)("denies AI Copilot (not entitled on pro)", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "aiCopilot",
            context: (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "aiCopilot"),
            entitlements: tier_fixtures_1.proTierFixture.entitlements,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.proTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: tier_fixtures_1.proTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
    });
    (0, vitest_1.it)("denies Malaysia localization (not entitled)", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "malaysiaLocalization",
            context: (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "malaysiaLocalization"),
            entitlements: tier_fixtures_1.proTierFixture.entitlements,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.proTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: tier_fixtures_1.proTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
    });
    (0, vitest_1.it)("allows Vietnam localization", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "vietnamLocalization",
            context: (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "vietnamLocalization", { localization: "vn" }),
            entitlements: tier_fixtures_1.proTierFixture.entitlements,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.proTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: tier_fixtures_1.proTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("allow");
    });
});
// ---------------------------------------------------------------------------
// Enterprise tier
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("Enterprise tier", function () {
    (0, vitest_1.it)("allows all core modules", function () {
        for (var _i = 0, _a = [
            "accounting",
            "mrp",
            "lotTracking",
            "auditExport",
            "sso",
            "prioritySupport",
            "selfHostedDeployment",
        ]; _i < _a.length; _i++) {
            var capability = _a[_i];
            var result = (0, capability_evaluation_1.evaluateCapability)({
                capabilityKey: capability,
                context: (0, tier_fixtures_1.buildContext)("tenant_enterprise", "company_enterprise", capability),
                entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
                featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
                usageLimits: tier_fixtures_1.enterpriseTierFixture.usageLimits,
                betaFlags: tier_fixtures_1.enterpriseTierFixture.betaFlags,
                killSwitches: tier_fixtures_1.enterpriseTierFixture.killSwitches,
                localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
                evaluatedAt: EVAL_AT,
                correlationId: nextCorr(),
            });
            (0, vitest_1.expect)(result.result, "capability=".concat(capability)).toBe("allow");
        }
    });
    (0, vitest_1.it)("allows Vietnam and Malaysia localization", function () {
        for (var _i = 0, _a = [
            ["vietnamLocalization", "vn"],
            ["malaysiaLocalization", "my"],
        ]; _i < _a.length; _i++) {
            var _b = _a[_i], capability = _b[0], locale = _b[1];
            var result = (0, capability_evaluation_1.evaluateCapability)({
                capabilityKey: capability,
                context: (0, tier_fixtures_1.buildContext)("tenant_enterprise", "company_enterprise", capability, { localization: locale }),
                entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
                featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
                usageLimits: tier_fixtures_1.enterpriseTierFixture.usageLimits,
                betaFlags: tier_fixtures_1.enterpriseTierFixture.betaFlags,
                killSwitches: tier_fixtures_1.enterpriseTierFixture.killSwitches,
                localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
                evaluatedAt: EVAL_AT,
                correlationId: nextCorr(),
            });
            (0, vitest_1.expect)(result.result, "capability=".concat(capability)).toBe("allow");
        }
    });
    (0, vitest_1.it)("denies AI Recommendations (beta-only, no beta flag on context)", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "aiRecommendations",
            context: (0, tier_fixtures_1.buildContext)("tenant_enterprise", "company_enterprise", "aiRecommendations"),
            entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
            featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.enterpriseTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.enterpriseTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.enterpriseTierFixture.killSwitches,
            localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
    });
    (0, vitest_1.it)("denies accounting when company context does not match tenant scope", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "accounting",
            context: (0, tier_fixtures_1.buildContext)("tenant_other", "company_other", "accounting"),
            entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
            featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.enterpriseTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.enterpriseTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.enterpriseTierFixture.killSwitches,
            localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
    });
    (0, vitest_1.it)("returns structured audit evidence on denial", function () {
        var _a;
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "accounting",
            context: (0, tier_fixtures_1.buildContext)("wrong_tenant", "company_enterprise", "accounting"),
            entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
            featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.enterpriseTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.enterpriseTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.enterpriseTierFixture.killSwitches,
            localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: "corr_audit_enterprise",
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
        (0, vitest_1.expect)(result.audit).toMatchObject({
            result: "not_entitled",
            correlationId: "corr_audit_enterprise",
            evaluatedAt: EVAL_AT,
        });
        (0, vitest_1.expect)(Array.isArray((_a = result.audit) === null || _a === void 0 ? void 0 : _a.evidence)).toBe(true);
    });
});
// ---------------------------------------------------------------------------
// Beta tier
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("Beta tier", function () {
    (0, vitest_1.it)("allows AI Recommendations for allowlisted tenant with beta context flag", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "aiRecommendations",
            context: (0, tier_fixtures_1.buildContext)("tenant_beta", "company_beta", "aiRecommendations", {
                betaFlags: ["ai_recommendations"],
            }),
            entitlements: tier_fixtures_1.betaTierFixture.entitlements,
            featureFlags: tier_fixtures_1.betaTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.betaTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.betaTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.betaTierFixture.killSwitches,
            localizations: tier_fixtures_1.betaTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("allow");
    });
    (0, vitest_1.it)("blocks non-allowlisted tenant at feature flag layer (disabled before beta check)", function () {
        // The feature flag for ai_recommendations restricts to tenantAllowlist:["tenant_beta"].
        // A tenant not on that list is denied at the flag layer before beta evaluation.
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "aiRecommendations",
            context: (0, tier_fixtures_1.buildContext)("tenant_non_beta", "company_non_beta", "aiRecommendations", { betaFlags: ["ai_recommendations"] }),
            entitlements: tier_fixtures_1.betaTierFixture.entitlements,
            featureFlags: tier_fixtures_1.betaTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.betaTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.betaTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.betaTierFixture.killSwitches,
            localizations: tier_fixtures_1.betaTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("disabled");
    });
    (0, vitest_1.it)("returns beta_required when entitlement is present, feature flag is open, but beta allowlist excludes tenant and context has no flag", function () {
        // To exercise the beta_required path we need:
        //  1. Feature flag with no tenant restriction (tenantAllowlist: [])
        //  2. Entitlement present for this tenant
        //  3. BetaFlag that excludes this tenant (not in allowlist, no context flag)
        var openFeatureFlag = {
            key: "ai_recommendations",
            enabled: true,
            rollout: "beta",
            environments: ["production"],
            tenantAllowlist: [],
            companyAllowlist: [],
            killSwitchKey: "beta.ai_recommendations.kill_switch",
            metadata: {},
        };
        var restrictiveBetaFlag = {
            key: "ai_recommendations",
            enabled: true,
            tenantAllowlist: ["tenant_different_only"],
            companyAllowlist: [],
            startsAt: null,
            endsAt: null,
            metadata: {},
        };
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "aiRecommendations",
            context: (0, tier_fixtures_1.buildContext)("tenant_beta", "company_beta", "aiRecommendations"),
            entitlements: tier_fixtures_1.betaTierFixture.entitlements,
            featureFlags: __spreadArray([openFeatureFlag], tier_fixtures_1.enterpriseTierFixture.featureFlags, true),
            usageLimits: tier_fixtures_1.betaTierFixture.usageLimits,
            betaFlags: [restrictiveBetaFlag],
            killSwitches: tier_fixtures_1.betaTierFixture.killSwitches,
            localizations: tier_fixtures_1.betaTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("beta_required");
    });
});
// ---------------------------------------------------------------------------
// Disabled-state / kill-switch scenarios
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("Disabled state — kill switches active", function () {
    (0, vitest_1.it)("blocks accounting when kill switch is armed regardless of entitlements", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "accounting",
            context: (0, tier_fixtures_1.buildContext)("tenant_enterprise", "company_enterprise", "accounting"),
            entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
            featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.enterpriseTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.enterpriseTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.disabledStateFixture.killSwitches,
            localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("kill_switch_active");
    });
    (0, vitest_1.it)("blocks AI Copilot when kill switch is armed", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "aiCopilot",
            context: (0, tier_fixtures_1.buildContext)("tenant_enterprise", "company_enterprise", "aiCopilot", { betaFlags: ["ai_recommendations"] }),
            entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
            featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.enterpriseTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.betaTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.disabledStateFixture.killSwitches,
            localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("kill_switch_active");
    });
    (0, vitest_1.it)("includes audit record with kill switch key on denial", function () {
        var _a, _b;
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "accounting",
            context: (0, tier_fixtures_1.buildContext)("tenant_enterprise", "company_enterprise", "accounting"),
            entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
            featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.enterpriseTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.enterpriseTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.disabledStateFixture.killSwitches,
            localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: "corr_ks_audit",
        });
        (0, vitest_1.expect)(result.audit).toMatchObject({
            result: "kill_switch_active",
            correlationId: "corr_ks_audit",
        });
        (0, vitest_1.expect)((_b = (_a = result.audit) === null || _a === void 0 ? void 0 : _a.evidence[0]) === null || _b === void 0 ? void 0 : _b.key).toBe("module.accounting.kill_switch");
    });
});
// ---------------------------------------------------------------------------
// Usage-limit scenarios
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("Usage limit enforcement", function () {
    (0, vitest_1.it)("denies e-Invoice when monthly volume is exhausted", function () {
        var _a;
        var exhaustedLimits = tier_fixtures_1.proTierFixture.usageLimits.map(function (l) {
            return l.key === "einvoice.volume.monthly" ? __assign(__assign({}, l), { used: l.maximum }) : l;
        });
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "eInvoice",
            context: (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "eInvoice", {
                localization: "vn",
            }),
            entitlements: tier_fixtures_1.proTierFixture.entitlements,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: exhaustedLimits,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: tier_fixtures_1.proTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: "corr_limit_einvoice",
        });
        (0, vitest_1.expect)(result.result).toBe("limit_exceeded");
        (0, vitest_1.expect)((_a = result.audit) === null || _a === void 0 ? void 0 : _a.evidence[0]).toMatchObject({
            key: "einvoice.volume.monthly",
            expected: 500,
            actual: 500,
        });
    });
    (0, vitest_1.it)("denies AI Copilot with limit_exceeded when token limit is at maximum and beta context flag present", function () {
        var _a;
        // aiCopilot evaluates: kill_switch → feature_flag → entitlement → beta_flag → limit
        // With context.betaFlags=["ai_recommendations"], beta check passes via contextFlagEnabled.
        // The exhausted limit is then the terminal denial reason.
        var exhaustedLimits = tier_fixtures_1.enterpriseTierFixture.usageLimits.map(function (l) {
            return l.key === "ai.tokens.monthly" ? __assign(__assign({}, l), { used: l.maximum }) : l;
        });
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "aiCopilot",
            context: (0, tier_fixtures_1.buildContext)("tenant_enterprise", "company_enterprise", "aiCopilot", { betaFlags: ["ai_recommendations"] }),
            entitlements: tier_fixtures_1.enterpriseTierFixture.entitlements,
            featureFlags: tier_fixtures_1.enterpriseTierFixture.featureFlags,
            usageLimits: exhaustedLimits,
            betaFlags: tier_fixtures_1.betaTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.enterpriseTierFixture.killSwitches,
            localizations: tier_fixtures_1.enterpriseTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: "corr_limit_ai",
        });
        (0, vitest_1.expect)(result.result).toBe("limit_exceeded");
        (0, vitest_1.expect)((_a = result.audit) === null || _a === void 0 ? void 0 : _a.evidence[0]).toMatchObject({
            key: "ai.tokens.monthly",
        });
    });
    (0, vitest_1.it)("allows when used equals zero against positive maximum", function () {
        var zeroUsage = tier_fixtures_1.proTierFixture.usageLimits.map(function (l) {
            return l.key === "einvoice.volume.monthly" ? __assign(__assign({}, l), { used: 0 }) : l;
        });
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "eInvoice",
            context: (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "eInvoice", {
                localization: "vn",
            }),
            entitlements: tier_fixtures_1.proTierFixture.entitlements,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: zeroUsage,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: tier_fixtures_1.proTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("allow");
    });
});
// ---------------------------------------------------------------------------
// Localization-gated scenarios
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("Localization-gated access", function () {
    (0, vitest_1.it)("denies e-Invoice when localization entitlement is absent (localization_required)", function () {
        var entitlementsWithoutLocalization = tier_fixtures_1.proTierFixture.entitlements.filter(function (e) { return e.key !== "localization.vn.enabled"; });
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "eInvoice",
            context: (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "eInvoice", {
                localization: "vn",
            }),
            entitlements: entitlementsWithoutLocalization,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.proTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: tier_fixtures_1.proTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: "corr_loc_required",
        });
        (0, vitest_1.expect)(result.result).toBe("localization_required");
        (0, vitest_1.expect)(result.audit).toMatchObject({
            result: "localization_required",
            correlationId: "corr_loc_required",
        });
    });
    (0, vitest_1.it)("denies Vietnam localization when localization record is absent", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "vietnamLocalization",
            context: (0, tier_fixtures_1.buildContext)("tenant_pro", "company_pro", "vietnamLocalization", { localization: "vn" }),
            entitlements: tier_fixtures_1.proTierFixture.entitlements,
            featureFlags: tier_fixtures_1.proTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.proTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.proTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.proTierFixture.killSwitches,
            localizations: [],
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("localization_required");
    });
});
// ---------------------------------------------------------------------------
// Audit contract integrity
// ---------------------------------------------------------------------------
(0, vitest_1.describe)("Audit contract integrity", function () {
    (0, vitest_1.it)("audit event is JSON-serializable", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "mrp",
            context: (0, tier_fixtures_1.buildContext)("tenant_basic", "company_basic", "mrp"),
            entitlements: tier_fixtures_1.basicTierFixture.entitlements,
            featureFlags: tier_fixtures_1.basicTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.basicTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.basicTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.basicTierFixture.killSwitches,
            localizations: tier_fixtures_1.basicTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: "corr_json_safe",
        });
        (0, vitest_1.expect)(result.result).toBe("not_entitled");
        (0, vitest_1.expect)(function () { return JSON.stringify(result.audit); }).not.toThrow();
        (0, vitest_1.expect)(JSON.parse(JSON.stringify(result.audit))).toEqual(result.audit);
    });
    (0, vitest_1.it)("allowed decision returns null audit", function () {
        var result = (0, capability_evaluation_1.evaluateCapability)({
            capabilityKey: "accounting",
            context: (0, tier_fixtures_1.buildContext)("tenant_basic", "company_basic", "accounting"),
            entitlements: tier_fixtures_1.basicTierFixture.entitlements,
            featureFlags: tier_fixtures_1.basicTierFixture.featureFlags,
            usageLimits: tier_fixtures_1.basicTierFixture.usageLimits,
            betaFlags: tier_fixtures_1.basicTierFixture.betaFlags,
            killSwitches: tier_fixtures_1.basicTierFixture.killSwitches,
            localizations: tier_fixtures_1.basicTierFixture.localizations,
            evaluatedAt: EVAL_AT,
            correlationId: nextCorr(),
        });
        (0, vitest_1.expect)(result.result).toBe("allow");
        (0, vitest_1.expect)(result.audit).toBeNull();
    });
});
