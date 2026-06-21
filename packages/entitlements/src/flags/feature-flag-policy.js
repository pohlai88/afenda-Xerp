"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_FLAG_STRICT_POLICY = exports.FEATURE_FLAG_ROLLOUT_POLICY = exports.FEATURE_FLAG_FAIL_OPEN_DEFAULT = void 0;
/**
 * Default rollout policy when a feature flag key is absent from the registry.
 *
 * Fail-open enables gradual rollout: new code paths stay enabled until an
 * operator registers and disables a flag. Do not rely on this default for
 * security-sensitive capabilities — use `resolveFeatureFlagStrict` instead.
 */
exports.FEATURE_FLAG_FAIL_OPEN_DEFAULT = true;
exports.FEATURE_FLAG_ROLLOUT_POLICY = {
    missingFlagBehavior: "allow",
};
exports.FEATURE_FLAG_STRICT_POLICY = {
    missingFlagBehavior: "deny",
};
