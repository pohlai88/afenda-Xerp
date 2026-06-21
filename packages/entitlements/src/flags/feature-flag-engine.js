"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureFlag = featureFlag;
exports.resolveFeatureFlag = resolveFeatureFlag;
exports.resolveFeatureFlagStrict = resolveFeatureFlagStrict;
var feature_flag_policy_1 = require("./feature-flag-policy");
/**
 * Returns whether a feature flag is enabled for the given context.
 *
 * Missing flags fail open (`enabled: true`) to support gradual rollout.
 * For security-sensitive paths use `resolveFeatureFlagStrict`.
 */
function featureFlag(key, flags, context) {
    return resolveFeatureFlag(key, flags, context).enabled;
}
/**
 * Resolves a feature flag using the rollout policy (fail-open when missing).
 *
 * When `matchingFlag` is undefined the resolver returns `enabled: true`.
 * This is intentional for staged deployments but must not be used as an
 * authorization gate. Pair with entitlement checks or `resolveFeatureFlagStrict`.
 */
function resolveFeatureFlag(key, flags, context, policy) {
    if (policy === void 0) { policy = feature_flag_policy_1.FEATURE_FLAG_ROLLOUT_POLICY; }
    var matchingFlag = flags.find(function (flag) { return flag.key === key; });
    if (!matchingFlag) {
        return {
            key: key,
            enabled: policy.missingFlagBehavior === "allow",
            flag: null,
        };
    }
    var environmentAllowed = matchingFlag.environments.includes(context.environment);
    var tenantAllowed = matchingFlag.tenantAllowlist.length === 0 ||
        matchingFlag.tenantAllowlist.includes(context.tenantId);
    var companyAllowed = matchingFlag.companyAllowlist.length === 0 ||
        matchingFlag.companyAllowlist.includes(context.companyId);
    return {
        key: key,
        enabled: matchingFlag.enabled &&
            matchingFlag.rollout !== "off" &&
            environmentAllowed &&
            tenantAllowed &&
            companyAllowed,
        flag: matchingFlag,
    };
}
/**
 * Strict resolver for security-sensitive feature gates.
 *
 * Missing flags return `enabled: false`. Prefer this over `resolveFeatureFlag`
 * when absence of registry data must deny access (SSO, admin surfaces, etc.).
 */
function resolveFeatureFlagStrict(key, flags, context) {
    return resolveFeatureFlag(key, flags, context, feature_flag_policy_1.FEATURE_FLAG_STRICT_POLICY);
}
