import type {
  DeploymentEnvironment,
  FeatureFlagKey,
  JsonValue,
  KillSwitchKey,
} from "./shared.contract";

export type FeatureFlagRollout = "off" | "internal" | "beta" | "limited" | "on";

export interface FeatureFlagContract {
  readonly companyAllowlist: readonly string[];
  readonly enabled: boolean;
  readonly environments: readonly DeploymentEnvironment[];
  readonly key: FeatureFlagKey;
  readonly killSwitchKey: KillSwitchKey | null;
  readonly metadata: Readonly<Record<string, JsonValue>>;
  readonly rollout: FeatureFlagRollout;
  readonly tenantAllowlist: readonly string[];
}
