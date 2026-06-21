"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDatabaseBundleToEvaluationData = mapDatabaseBundleToEvaluationData;
var USAGE_LIMIT_KEYS = [
    "users.max",
    "companies.max",
    "organizations.max",
    "api.calls.daily",
    "storage.gb.max",
    "ai.tokens.monthly",
    "einvoice.volume.monthly",
    "automation.runs.monthly",
];
function isUsageLimitKey(key) {
    return USAGE_LIMIT_KEYS.includes(key);
}
function isDeploymentEnvironment(value) {
    if (value === null) {
        return true;
    }
    return (value === "development" ||
        value === "preview" ||
        value === "staging" ||
        value === "production" ||
        value === "test");
}
/** Maps a persisted tenant bundle into evaluation-ready entitlement contracts. */
function mapDatabaseBundleToEvaluationData(bundle) {
    return {
        entitlements: bundle.entitlements.map(function (grant) { return ({
            key: grant.key,
            type: grant.type,
            enabled: grant.enabled,
            scope: grant.scope,
            tenantId: grant.tenantId,
            companyId: grant.companyId,
            environment: isDeploymentEnvironment(grant.environment)
                ? grant.environment
                : null,
            metadata: grant.metadata,
        }); }),
        usageLimits: bundle.usageLimits.flatMap(function (limit) {
            if (!isUsageLimitKey(limit.key)) {
                return [];
            }
            return [
                {
                    key: limit.key,
                    scope: limit.scope,
                    period: limit.period,
                    maximum: limit.maximum,
                    used: limit.used,
                    unit: limit.unit,
                },
            ];
        }),
    };
}
