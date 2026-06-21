"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPlatformRolloutToEvaluationData = mapPlatformRolloutToEvaluationData;
var DEPLOYMENT_ENVIRONMENTS = [
    "development",
    "preview",
    "staging",
    "production",
    "test",
];
function isDeploymentEnvironment(value) {
    return DEPLOYMENT_ENVIRONMENTS.includes(value);
}
/** Maps persisted platform rollout rows into evaluation-ready contracts. */
function mapPlatformRolloutToEvaluationData(bundle) {
    return {
        featureFlags: bundle.featureFlags.map(function (flag) { return ({
            key: flag.key,
            enabled: flag.enabled,
            rollout: flag.rollout,
            environments: flag.environments.filter(isDeploymentEnvironment),
            tenantAllowlist: flag.tenantAllowlist,
            companyAllowlist: flag.companyAllowlist,
            killSwitchKey: flag.killSwitchKey,
            metadata: flag.metadata,
        }); }),
        killSwitches: bundle.killSwitches.map(function (killSwitch) { return ({
            key: killSwitch.key,
            active: killSwitch.active,
            severity: killSwitch.severity,
            reason: killSwitch.reason,
            activatedBy: killSwitch.activatedBy,
            activatedAt: killSwitch.activatedAt,
        }); }),
    };
}
