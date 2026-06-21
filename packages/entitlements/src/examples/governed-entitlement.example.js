"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.governedLocalizationsExample = exports.governedKillSwitchesExample = exports.governedBetaFlagsExample = exports.governedUsageLimitsExample = exports.governedFeatureFlagsExample = exports.governedEntitlementsExample = exports.governedEntitlementContextExample = void 0;
exports.governedEntitlementContextExample = {
    tenantId: "tenant_afenda",
    companyId: "company_afenda",
    organizationId: "org_afenda",
    environment: "production",
    module: "accounting",
    feature: "eInvoice",
    userCount: 42,
    usageMetrics: {
        "einvoice.volume.monthly": 120,
    },
    localization: "vn",
    betaFlags: [],
};
exports.governedEntitlementsExample = [
    {
        key: "module.accounting.enabled",
        type: "module",
        enabled: true,
        scope: "tenant",
        tenantId: "tenant_afenda",
        companyId: null,
        environment: null,
        metadata: {},
    },
    {
        key: "feature.e_invoice.enabled",
        type: "feature",
        enabled: true,
        scope: "tenant",
        tenantId: "tenant_afenda",
        companyId: null,
        environment: null,
        metadata: {},
    },
    {
        key: "localization.vn.enabled",
        type: "localization",
        enabled: true,
        scope: "tenant",
        tenantId: "tenant_afenda",
        companyId: null,
        environment: null,
        metadata: {},
    },
];
exports.governedFeatureFlagsExample = [
    {
        key: "e_invoice",
        enabled: true,
        rollout: "on",
        environments: ["production"],
        tenantAllowlist: [],
        companyAllowlist: [],
        killSwitchKey: "feature.e_invoice.kill_switch",
        metadata: {},
    },
];
exports.governedUsageLimitsExample = [
    {
        key: "einvoice.volume.monthly",
        scope: "tenant",
        period: "monthly",
        maximum: 500,
        used: 120,
        unit: "documents",
    },
    {
        key: "ai.tokens.monthly",
        scope: "tenant",
        period: "monthly",
        maximum: 1000,
        used: 1000,
        unit: "tokens",
    },
];
exports.governedBetaFlagsExample = [
    {
        key: "ai_recommendations",
        enabled: true,
        tenantAllowlist: ["tenant_afenda"],
        companyAllowlist: [],
        startsAt: null,
        endsAt: null,
        metadata: {},
    },
];
exports.governedKillSwitchesExample = [
    {
        key: "feature.e_invoice.kill_switch",
        active: false,
        severity: "critical",
        reason: "",
        activatedBy: null,
        activatedAt: null,
    },
];
exports.governedLocalizationsExample = [
    {
        key: "vn",
        countryCode: "VN",
        enabled: true,
        requiredEntitlement: "localization.vn.enabled",
        jurisdictionName: "Vietnam",
    },
];
