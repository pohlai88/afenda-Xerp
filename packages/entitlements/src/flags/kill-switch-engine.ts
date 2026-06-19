import type { KillSwitchContract } from "../contracts/kill-switch.contract";
import type { KillSwitchKey } from "../contracts/shared.contract";

export interface KillSwitchResolution {
  readonly active: boolean;
  readonly key: KillSwitchKey;
  readonly killSwitch: KillSwitchContract | null;
}

export function resolveKillSwitch(
  key: KillSwitchKey,
  killSwitches: readonly KillSwitchContract[]
): KillSwitchResolution {
  const matchingSwitch = killSwitches.find((item) => item.key === key) ?? null;

  return {
    key,
    active: matchingSwitch?.active ?? false,
    killSwitch: matchingSwitch,
  };
}
