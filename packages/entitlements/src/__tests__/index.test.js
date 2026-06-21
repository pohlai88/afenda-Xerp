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
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var vitest_1 = require("vitest");
var index_1 = require("../index");
var requiredContractFiles = [
    "entitlement.contract.ts",
    "feature-flag.contract.ts",
    "usage-limit.contract.ts",
    "beta-flag.contract.ts",
    "kill-switch.contract.ts",
    "localization.contract.ts",
    "entitlement-context.contract.ts",
    "entitlement-decision.contract.ts",
    "entitlement-audit.contract.ts",
    "export.contract.ts",
];
var currentDirectory = (0, node_path_1.dirname)((0, node_url_1.fileURLToPath)(import.meta.url));
var sourceDirectory = (0, node_path_1.join)(currentDirectory, "..");
var enterprisePlanCheckPattern = /plan\s*={2,3}\s*["']enterprise["']/;
var premiumCustomerTypeCheckPattern = /customerType\s*={2,3}\s*["']premium["']/;
var proPlanCheckPattern = /plan\s*={2,3}\s*["']pro["']/;
(0, vitest_1.describe)("@afenda/entitlements", function () {
    (0, vitest_1.it)("exports a governed public package identity", function () {
        (0, vitest_1.expect)(index_1.PACKAGE_NAME).toBe("@afenda/entitlements");
        (0, vitest_1.expect)((0, index_1.getPackageName)()).toBe("@afenda/entitlements");
    });
    (0, vitest_1.it)("defines required TIP-008 contracts, types, limits, and results", function () {
        for (var _i = 0, requiredContractFiles_1 = requiredContractFiles; _i < requiredContractFiles_1.length; _i++) {
            var fileName = requiredContractFiles_1[_i];
            (0, vitest_1.expect)((0, node_fs_1.existsSync)((0, node_path_1.join)(currentDirectory, "..", "contracts", fileName))).toBe(true);
        }
        (0, vitest_1.expect)(index_1.entitlementTypes).toEqual([
            "module",
            "feature",
            "usage_limit",
            "localization",
            "deployment",
            "support",
            "security",
            "beta",
        ]);
        (0, vitest_1.expect)(index_1.requiredUsageLimitKeys).toEqual([
            "users.max",
            "companies.max",
            "organizations.max",
            "api.calls.daily",
            "storage.gb.max",
            "ai.tokens.monthly",
            "einvoice.volume.monthly",
            "automation.runs.monthly",
        ]);
        (0, vitest_1.expect)(index_1.entitlementDecisionResults).toEqual([
            "allow",
            "disabled",
            "beta_required",
            "localization_required",
            "limit_exceeded",
            "not_entitled",
            "kill_switch_active",
        ]);
    });
    (0, vitest_1.it)("resolves entitlement, feature flag, limit, and localization APIs", function () {
        (0, vitest_1.expect)((0, index_1.entitlement)("module.accounting.enabled", index_1.governedEntitlementsExample, {
            tenantId: "tenant_afenda",
            companyId: "company_afenda",
            environment: "production",
        })).toBe(true);
        (0, vitest_1.expect)((0, index_1.featureFlag)("e_invoice", index_1.governedFeatureFlagsExample, {
            tenantId: "tenant_afenda",
            companyId: "company_afenda",
            environment: "production",
        })).toBe(true);
        (0, vitest_1.expect)((0, index_1.limit)("einvoice.volume.monthly", index_1.governedUsageLimitsExample)).toEqual(vitest_1.expect.objectContaining({ allowed: true, used: 120, maximum: 500 }));
        (0, vitest_1.expect)((0, index_1.localization)("vn", index_1.governedLocalizationsExample, index_1.governedEntitlementsExample, {
            tenantId: "tenant_afenda",
            companyId: "company_afenda",
            environment: "production",
        })).toEqual(vitest_1.expect.objectContaining({ enabled: true }));
    });
    (0, vitest_1.it)("allows entitled capabilities and denies missing entitlements with audit evidence", function () {
        var allowedDecision = (0, index_1.evaluateCapability)({
            capabilityKey: "eInvoice",
            context: index_1.governedEntitlementContextExample,
            entitlements: index_1.governedEntitlementsExample,
            featureFlags: index_1.governedFeatureFlagsExample,
            usageLimits: index_1.governedUsageLimitsExample,
            betaFlags: [],
            killSwitches: index_1.governedKillSwitchesExample,
            localizations: index_1.governedLocalizationsExample,
            evaluatedAt: "2026-06-20T00:00:00.000Z",
            correlationId: "corr_allow",
        });
        var deniedDecision = (0, index_1.evaluateCapability)({
            capabilityKey: "accounting",
            context: index_1.governedEntitlementContextExample,
            entitlements: [],
            featureFlags: [],
            usageLimits: [],
            betaFlags: [],
            killSwitches: [],
            localizations: [],
            evaluatedAt: "2026-06-20T00:00:00.000Z",
            correlationId: "corr_denied",
        });
        (0, vitest_1.expect)(allowedDecision).toEqual({
            result: "allow",
            capabilityKey: "eInvoice",
            reason: "Capability is available.",
            audit: null,
        });
        (0, vitest_1.expect)(deniedDecision.result).toBe("not_entitled");
        (0, vitest_1.expect)(deniedDecision.audit).toEqual(vitest_1.expect.objectContaining({
            tenantId: "tenant_afenda",
            feature: "eInvoice",
            reason: "Required entitlement is missing.",
            correlationId: "corr_denied",
        }));
    });
    (0, vitest_1.it)("blocks exceeded limits, missing beta access, localization gaps, and kill switches", function () {
        var baseInput = {
            context: __assign(__assign({}, index_1.governedEntitlementContextExample), { feature: "aiCopilot" }),
            entitlements: __spreadArray(__spreadArray([], index_1.governedEntitlementsExample, true), [
                {
                    key: "module.ai_copilot.enabled",
                    type: "module",
                    enabled: true,
                    scope: "tenant",
                    tenantId: "tenant_afenda",
                    companyId: null,
                    environment: null,
                    metadata: {},
                },
            ], false),
            featureFlags: [
                {
                    key: "new_ai_copilot",
                    enabled: true,
                    rollout: "on",
                    environments: ["production"],
                    tenantAllowlist: [],
                    companyAllowlist: [],
                    killSwitchKey: "module.ai_copilot.kill_switch",
                    metadata: {},
                },
            ],
            usageLimits: index_1.governedUsageLimitsExample,
            betaFlags: [
                {
                    key: "ai_recommendations",
                    enabled: true,
                    tenantAllowlist: [],
                    companyAllowlist: [],
                    startsAt: null,
                    endsAt: null,
                    metadata: {},
                },
            ],
            killSwitches: [],
            localizations: index_1.governedLocalizationsExample,
            evaluatedAt: "2026-06-20T00:00:00.000Z",
            correlationId: "corr_ai",
        };
        (0, vitest_1.expect)((0, index_1.evaluateCapability)(__assign(__assign({}, baseInput), { capabilityKey: "aiCopilot" })).result).toBe("beta_required");
        (0, vitest_1.expect)((0, index_1.evaluateCapability)(__assign(__assign({}, baseInput), { capabilityKey: "aiCopilot", context: __assign(__assign({}, baseInput.context), { betaFlags: ["ai_recommendations"] }) })).result).toBe("limit_exceeded");
        (0, vitest_1.expect)((0, index_1.evaluateCapability)(__assign(__assign({}, baseInput), { capabilityKey: "eInvoice", localizations: [] })).result).toBe("localization_required");
        (0, vitest_1.expect)((0, index_1.evaluateCapability)(__assign(__assign({}, baseInput), { capabilityKey: "aiCopilot", killSwitches: [
                {
                    key: "module.ai_copilot.kill_switch",
                    active: true,
                    severity: "critical",
                    reason: "incident",
                    activatedBy: "ops",
                    activatedAt: "2026-06-20T00:00:00.000Z",
                },
            ] })).result).toBe("kill_switch_active");
    });
    (0, vitest_1.it)("keeps capability registry deterministic and JSON-safe", function () {
        (0, vitest_1.expect)(index_1.capabilityList).toHaveLength(Object.keys(index_1.capabilities).length);
        (0, vitest_1.expect)(JSON.parse(JSON.stringify(index_1.capabilityList))).toEqual(index_1.capabilityList);
        (0, vitest_1.expect)(index_1.capabilities.accounting.entitlementKey).toBe("module.accounting.enabled");
        (0, vitest_1.expect)(index_1.capabilities.eInvoice.localizationKey).toBe("vn");
    });
    (0, vitest_1.it)("prevents plan-name drift in entitlement source files", function () {
        var sourceText = readSourceFiles(sourceDirectory).join("\n");
        (0, vitest_1.expect)(sourceText).not.toMatch(enterprisePlanCheckPattern);
        (0, vitest_1.expect)(sourceText).not.toMatch(proPlanCheckPattern);
        (0, vitest_1.expect)(sourceText).not.toMatch(premiumCustomerTypeCheckPattern);
    });
});
function readSourceFiles(directory) {
    var files = [];
    for (var _i = 0, _a = (0, node_fs_1.readdirSync)(directory, { withFileTypes: true }); _i < _a.length; _i++) {
        var entry = _a[_i];
        var entryPath = (0, node_path_1.join)(directory, entry.name);
        if (entry.isDirectory()) {
            files.push.apply(files, readSourceFiles(entryPath));
            continue;
        }
        if ((0, node_path_1.extname)(entry.name) === ".ts") {
            files.push((0, node_fs_1.readFileSync)(entryPath, "utf8"));
        }
    }
    return files;
}
