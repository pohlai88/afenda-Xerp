import type { PlatformRolloutBundle } from "@afenda/database";

import type { FeatureFlagContract } from "../contracts/feature-flag.contract";
import type { KillSwitchContract } from "../contracts/kill-switch.contract";
import type { DeploymentEnvironment } from "../contracts/shared.contract";

const DEPLOYMENT_ENVIRONMENTS = [
  "development",
  "preview",
  "staging",
  "production",
  "test",
] as const satisfies readonly DeploymentEnvironment[];

function isDeploymentEnvironment(
  value: string
): value is DeploymentEnvironment {
  return (DEPLOYMENT_ENVIRONMENTS as readonly string[]).includes(value);
}

export interface MappedRolloutEvaluationData {
  readonly featureFlags: readonly FeatureFlagContract[];
  readonly killSwitches: readonly KillSwitchContract[];
}

/** Maps persisted platform rollout rows into evaluation-ready contracts. */
export function mapPlatformRolloutToEvaluationData(
  bundle: PlatformRolloutBundle
): MappedRolloutEvaluationData {
  return {
    featureFlags: bundle.featureFlags.map((flag) => ({
      key: flag.key,
      enabled: flag.enabled,
      rollout: flag.rollout,
      environments: flag.environments.filter(isDeploymentEnvironment),
      tenantAllowlist: flag.tenantAllowlist,
      companyAllowlist: flag.companyAllowlist,
      killSwitchKey: flag.killSwitchKey,
      metadata: flag.metadata as FeatureFlagContract["metadata"],
    })),
    killSwitches: bundle.killSwitches.map((killSwitch) => ({
      key: killSwitch.key,
      active: killSwitch.active,
      severity: killSwitch.severity,
      reason: killSwitch.reason,
      activatedBy: killSwitch.activatedBy,
      activatedAt: killSwitch.activatedAt,
    })),
  };
}
