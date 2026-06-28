import {
  type KillSwitchKey,
  resolveKillSwitch as resolveKillSwitchInternal,
} from "@afenda/entitlements";

import type { KillSwitchContract } from "../contracts/kill-switch.contract";

// Re-export the low-level resolver for consumers who need the full resolution object.
export { resolveKillSwitch } from "@afenda/entitlements";

/**
 * Foundation phase 08 spec-required API: boolean shorthand — returns `true` when the
 * kill switch is armed, `false` when it is inactive or not found.
 *
 * Kill switches are fail-closed: absent = inactive (false).
 */
export function killSwitch(
  key: KillSwitchKey,
  killSwitches: readonly KillSwitchContract[]
): boolean {
  return resolveKillSwitchInternal(key, killSwitches).active;
}
