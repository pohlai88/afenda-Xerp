"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateCapability = evaluateCapability;
var entitlement_audit_1 = require("../audit/entitlement-audit");
var beta_access_engine_1 = require("../beta/beta-access-engine");
var feature_flag_engine_1 = require("../flags/feature-flag-engine");
var kill_switch_engine_1 = require("../flags/kill-switch-engine");
var usage_limit_engine_1 = require("../limits/usage-limit-engine");
var localization_engine_1 = require("../localization/localization-engine");
var capability_registry_1 = require("./capability-registry");
var entitlement_engine_1 = require("./entitlement-engine");
function evaluateCapability(input) {
    var capability = (0, capability_registry_1.getCapability)(input.capabilityKey);
    if (!capability) {
        return deny(input, "disabled", "Capability is not registered.", [
            {
                key: "capabilityKey",
                expected: "registered",
                actual: input.capabilityKey,
            },
        ]);
    }
    if (capability.killSwitchKey) {
        var killSwitchResolution = (0, kill_switch_engine_1.resolveKillSwitch)(capability.killSwitchKey, input.killSwitches);
        if (killSwitchResolution.active) {
            return deny(input, "kill_switch_active", "Kill switch is active.", [
                {
                    key: capability.killSwitchKey,
                    expected: false,
                    actual: true,
                },
            ]);
        }
    }
    if (capability.featureFlagKey) {
        var flagResolution = (0, feature_flag_engine_1.resolveFeatureFlag)(capability.featureFlagKey, input.featureFlags, input.context);
        if (!flagResolution.enabled) {
            return deny(input, "disabled", "Feature flag is disabled.", [
                {
                    key: capability.featureFlagKey,
                    expected: true,
                    actual: false,
                },
            ]);
        }
    }
    var entitlementResolution = (0, entitlement_engine_1.resolveEntitlement)(capability.entitlementKey, input.entitlements, input.context);
    if (!entitlementResolution.enabled) {
        return deny(input, "not_entitled", "Required entitlement is missing.", [
            {
                key: capability.entitlementKey,
                expected: true,
                actual: false,
            },
        ]);
    }
    if (capability.localizationKey) {
        var localizationResolution = (0, localization_engine_1.resolveLocalizationAccess)(capability.localizationKey, input.localizations, input.entitlements, input.context);
        if (!localizationResolution.enabled) {
            return deny(input, "localization_required", "Localization entitlement is missing.", [
                {
                    key: capability.localizationKey,
                    expected: true,
                    actual: false,
                },
            ]);
        }
    }
    if (capability.betaFlagKey) {
        var betaResolution = (0, beta_access_engine_1.resolveBetaAccess)(capability.betaFlagKey, input.betaFlags, input.context);
        if (!betaResolution.enabled) {
            return deny(input, "beta_required", "Beta access is required.", [
                {
                    key: capability.betaFlagKey,
                    expected: true,
                    actual: false,
                },
            ]);
        }
    }
    if (capability.limitKey) {
        var limitResolution = (0, usage_limit_engine_1.resolveUsageLimit)(capability.limitKey, input.usageLimits);
        if (!limitResolution.allowed) {
            return deny(input, "limit_exceeded", "Usage limit is exceeded.", [
                {
                    key: capability.limitKey,
                    expected: limitResolution.maximum,
                    actual: limitResolution.used,
                },
            ]);
        }
    }
    return {
        result: "allow",
        capabilityKey: input.capabilityKey,
        reason: "Capability is available.",
        audit: null,
    };
}
function deny(input, result, reason, evidence) {
    return {
        result: result,
        capabilityKey: input.capabilityKey,
        reason: reason,
        audit: (0, entitlement_audit_1.createEntitlementAuditEvent)({
            context: input.context,
            result: result,
            reason: reason,
            evaluatedAt: input.evaluatedAt,
            correlationId: input.correlationId,
            evidence: evidence,
        }),
    };
}
